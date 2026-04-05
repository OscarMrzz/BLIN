"use client";
import { ConfirmarEliminar } from "@/components/Confirmacion/ConfirmarEliminar";
import { EditarTarjeta } from "@/components/Formularios/tarjetas/FormularioEditarTarjeta";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { TargetasInterface } from "@/Interfaces/targetas.interface";
import {
  getAllTarjetasForTable,
  deleteTarjeta,
  getTarjetaById,
} from "@/lib/services/tarjetasServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import ModalVerTarjeta from "@/components/Ver/ModalVerTarjeta";
import { AgregarTarjeta } from "@/components/Formularios/tarjetas/FormularioAgregartarjeta";

export default function Page() {
  const { data: tarjetasList, refetch } = useQuery({
    queryKey: ["getAllTarjetasForTable"],
    queryFn: getAllTarjetasForTable,
  });

  const refrescarTabla = () => {
    refetch();
  };

  const [showModal, setShowModal] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] =
    useState<TargetasInterface | null>(null);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [tarjetaAEditar, setTarjetaAEditar] =
    useState<TargetasInterface | null>(null);
  const [nombreTarjeta, setNombreTarjeta] = useState("");
  const [idTarjeta, setIdTarjeta] = useState("");

  const handleEliminar = async (id: string) => {
    try {
      console.log("Iniciando eliminación de la tarjeta con ID:", id);
      await deleteTarjeta(id);
      toast.success("Tarjeta eliminada correctamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
    } catch (error) {
      console.error("Error al eliminar la tarjeta:", error);

      // Mostrar mensaje de error más específico
      let errorMessage = "Error al eliminar la tarjeta";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 5000,
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

    // Buscar la tarjeta por su índice original
    const tarjetaBuscada = tarjetasList?.datos[indice];

    if (!tarjetaBuscada) {
      console.error("No se encontró la tarjeta en el índice:", indice);
      return;
    }

    // Obtener el ID real para la eliminación
    const idReal = tarjetaBuscada.id_targetas;

    setNombreTarjeta(`Tarjeta #${tarjetaBuscada.codigo_targeta || ""}`);
    setIdTarjeta(idReal);
    setShowModal(true);
  };

  const abrirModalEditar = async (idFila: string) => {
    // Extraer el índice del ID de TanStack Table (formato: "row-0", "row-1", etc.)
    const indice = parseInt(idFila.replace("row-", ""), 10);

    if (isNaN(indice)) {
      console.error("ID de fila inválido:", idFila);
      return;
    }

    // Buscar la tarjeta por su índice original para obtener el ID real
    const tarjetaBuscada = tarjetasList?.datos[indice];

    if (!tarjetaBuscada) {
      console.error("No se encontró la tarjeta en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = tarjetaBuscada.id_targetas;

    try {
      // Obtener los datos completos y actualizados de la tarjeta
      const tarjetaCompleta = await getTarjetaById(idReal);

      if (tarjetaCompleta) {
        setTarjetaAEditar(tarjetaCompleta);
        setShowModalEditar(true);
      } else {
        console.error("No se pudo obtener la tarjeta completa");
        // Como fallback, usar los datos de la tabla
        setTarjetaAEditar(tarjetaBuscada);
        setShowModalEditar(true);
      }
    } catch (error) {
      console.error("Error al obtener la tarjeta completa:", error);
      // Como fallback, usar los datos de la tabla
      setTarjetaAEditar(tarjetaBuscada);
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

    // Buscar la tarjeta por su índice original para obtener el ID real
    const tarjetaBuscada = tarjetasList?.datos[indice];

    if (!tarjetaBuscada) {
      console.error("No se encontró la tarjeta en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = tarjetaBuscada.id_targetas;

    try {
      // Obtener los datos completos y actualizados de la tarjeta
      const tarjetaCompleta = await getTarjetaById(idReal);

      if (tarjetaCompleta) {
        setTarjetaSeleccionada(tarjetaCompleta);
        setShowModalVer(true);
      } else {
        console.error("No se pudo obtener la tarjeta completa");
        // Como fallback, usar los datos de la tabla
        setTarjetaSeleccionada(tarjetaBuscada);
        setShowModalVer(true);
      }
    } catch (error) {
      console.error("Error al obtener la tarjeta completa:", error);
      // Como fallback, usar los datos de la tabla
      setTarjetaSeleccionada(tarjetaBuscada);
      setShowModalVer(true);
    }
  };

  return (
    <div className="flex px-12">
      <TablaGeneral
        data={tarjetasList?.datos || []}
        columns={tarjetasList?.columnas || []}
        refrescarTabla={refrescarTabla}
        AbrirModalEliminar={abrirModalEliminar}
        AbrirFormularioEditar={abrirModalEditar}
        AbrirModalVer={abrirModalVer}
        BotonAgregar={AgregarTarjeta}
      />

      <ConfirmarEliminar
        open={showModal}
        setOpen={setShowModal}
        onConfirm={() => handleEliminar(idTarjeta)}
        nombreRuta={nombreTarjeta}
      />
      <Toaster />
      {showModalEditar && tarjetaAEditar && (
        <EditarTarjeta
          open={showModalEditar}
          setOpen={setShowModalEditar}
          refrescarTabla={refrescarTabla}
          tarjetaAEditar={tarjetaAEditar}
        />
      )}

      {showModalVer && tarjetaSeleccionada && (
        <ModalVerTarjeta
          open={showModalVer}
          setOpen={setShowModalVer}
          tarjetaSeleccionada={tarjetaSeleccionada}
        />
      )}
    </div>
  );
}
