"use client";
import { ConfirmarEliminar } from "@/components/Confirmacion/ConfirmarEliminar";
import { FormularioEditarStopping } from "@/components/Formularios/Stopping/FormularioEditarStopping";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { StoppingInterface } from "@/Interfaces/rutas.interface";
import {
  getAllParadasForTable,
  deleteParada,
  getParadaByIdParada,
} from "@/lib/services/ParadasServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import ModalVerStopping from "@/components/Ver/ModalVerStopping";
import { AgregarStopping } from "@/components/Formularios/Stopping/FormularioAgregarStopping";

export default function Page() {
  const { data: paradasList, refetch } = useQuery({
    queryKey: ["getAllParadasForTable"],
    queryFn: getAllParadasForTable,
  });

  const refrescarTabla = () => {
    refetch();
  };

  const [showModal, setShowModal] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [paradaSeleccionada, setParadaSeleccionada] =
    useState<StoppingInterface | null>(null);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [paradaAEditar, setParadaAEditar] = useState<StoppingInterface | null>(
    null,
  );
  const [nombreParada, setNombreParada] = useState("");
  const [idParada, setIdParada] = useState("");

  const handleEliminar = async (id: string) => {
    try {
      await deleteParada(id);
      toast.success("Parada eliminada correctamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
    } catch (error) {
      console.error("Error al eliminar la parada:", error);
      toast.error("Error al eliminar la parada", {
        duration: 3000,
        style: {
          background: "red",
          color: "white",
        },
      });
    } finally {
      refetch();
    }
  };

  const abrirModalEliminar = (idFila: string) => {
    // Extraer el índice del ID de TanStack Table (formato: "row-0", "row-1", etc.)
    const indice = parseInt(idFila.replace("row-", ""), 10);

    if (isNaN(indice)) {
      console.error("ID de fila inválido:", idFila);
      return;
    }

    // Buscar la parada por su índice original
    const paradaBuscada = paradasList?.datos[indice];

    if (!paradaBuscada) {
      console.error("No se encontró la parada en el índice:", indice);
      return;
    }

    // Obtener el ID real para la eliminación
    const idReal = paradaBuscada.id_paradas;

    setNombreParada(paradaBuscada.nombre_lugar || "");
    setIdParada(idReal);
    setShowModal(true);
  };

  const abrirModalEditar = async (idFila: string) => {
    // Extraer el índice del ID de TanStack Table (formato: "row-0", "row-1", etc.)
    const indice = parseInt(idFila.replace("row-", ""), 10);

    if (isNaN(indice)) {
      console.error("ID de fila inválido:", idFila);
      return;
    }

    // Buscar la parada por su índice original para obtener el ID real
    const paradaBuscada = paradasList?.datos[indice];

    if (!paradaBuscada) {
      console.error("No se encontró la parada en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = paradaBuscada.id_paradas;

    try {
      // Obtener los datos completos y actualizados de la parada
      const paradaCompleta = await getParadaByIdParada(idReal);

      if (paradaCompleta) {
        setParadaAEditar(paradaCompleta);
        setShowModalEditar(true);
      } else {
        console.error("No se pudo obtener la parada completa");
        // Como fallback, usar los datos de la tabla
        setParadaAEditar(paradaBuscada);
        setShowModalEditar(true);
      }
    } catch (error) {
      console.error("Error al obtener la parada completa:", error);
      // Como fallback, usar los datos de la tabla
      setParadaAEditar(paradaBuscada);
      setShowModalEditar(true);
    }
  };

  const abrirModalVer = async (idFila: string) => {
    // Extraer el índice del ID de TanStack Table (formato: "row-0", "row-1", etc.)
    const indice = parseInt(idFila.replace("row-", ""), 10);

    if (isNaN(indice)) {
      console.error("ID de fila inválido:", idFila);
      return;
    }

    // Buscar la parada por su índice original para obtener el ID real
    const paradaBuscada = paradasList?.datos[indice];

    if (!paradaBuscada) {
      console.error("No se encontró la parada en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = paradaBuscada.id_paradas;

    try {
      // Obtener los datos completos y actualizados de la parada
      const paradaCompleta = await getParadaByIdParada(idReal);

      if (paradaCompleta) {
        setParadaSeleccionada(paradaCompleta);
        setShowModalVer(true);
      } else {
        console.error("No se pudo obtener la parada completa");
        // Como fallback, usar los datos de la tabla
        setParadaSeleccionada(paradaBuscada);
        setShowModalVer(true);
      }
    } catch (error) {
      console.error("Error al obtener la parada completa:", error);
      // Como fallback, usar los datos de la tabla
      setParadaSeleccionada(paradaBuscada);
      setShowModalVer(true);
    }
  };

  return (
    <div className="flex px-12">
      <TablaGeneral
        data={paradasList?.datos || []}
        columns={paradasList?.columnas || []}
        refrescarTabla={refrescarTabla}
        AbrirModalEliminar={abrirModalEliminar}
        AbrirFormularioEditar={abrirModalEditar}
        AbrirModalVer={abrirModalVer}
        BotonAgregar={AgregarStopping}
      />

      <ConfirmarEliminar
        open={showModal}
        setOpen={setShowModal}
        onConfirm={() => handleEliminar(idParada)}
        nombreRuta={nombreParada}
      />
      <Toaster />
      {showModalEditar && paradaAEditar && (
        <FormularioEditarStopping
          open={showModalEditar}
          setOpen={setShowModalEditar}
          refrescarTabla={refrescarTabla}
          stoppingAEditar={paradaAEditar}
        />
      )}

      {showModalVer && paradaSeleccionada && (
        <ModalVerStopping
          open={showModalVer}
          setOpen={setShowModalVer}
          paradaSeleccionada={paradaSeleccionada}
        />
      )}
    </div>
  );
}
