"use client";
import { ConfirmarEliminar } from "@/components/Confirmacion/ConfirmarEliminar";
import { FormularioEditarRuta } from "@/components/Formularios/Rutas/FormularioEditarRuta";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { RutasInterface } from "@/Interfaces/rutas.interface";
import {
  getAllRutasForTable,
  deleteRuta,
  getRutaById,
} from "@/lib/services/rutasServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import ModalverRuta from "@/components/Ver/ModalverRuta";
import { AgregarRuta } from "@/components/Formularios/Rutas/AgregarRuta";

export default function Page() {
  const { data: rutasList, refetch } = useQuery({
    queryKey: ["getAllRutasForTable"],
    queryFn: getAllRutasForTable,
  });

  const refrescarTabla = () => {
    refetch();
  };

  const [showModal, setShowModal] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [rutaSelecionada, setRutaSelecionada] = useState<RutasInterface | null>(
    null,
  );
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [rutaAEditar, setRutaAEditar] = useState<RutasInterface | null>(null);
  const [nombreRuta, setNombreRuta] = useState("");
  const [idRuta, setIdRuta] = useState("");

  const handleEliminar = async (id: string) => {
    try {
      await deleteRuta(id);
      toast.success("Ruta eliminada correctamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
    } catch (error) {
      console.error("Error al eliminar la ruta:", error);
      toast.error("Error al eliminar la ruta", {
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

    // Buscar la ruta por su índice original
    const rutaBuscada = rutasList?.datos[indice];

    if (!rutaBuscada) {
      console.error("No se encontró la ruta en el índice:", indice);
      return;
    }

    // Obtener el ID real para la eliminación
    const idReal = rutaBuscada.id_rutas;

    setNombreRuta(rutaBuscada.nombre || "");
    setIdRuta(idReal);
    setShowModal(true);
  };

  const abrirModalEditar = async (idFila: string) => {
    // Extraer el índice del ID de TanStack Table (formato: "row-0", "row-1", etc.)
    const indice = parseInt(idFila.replace("row-", ""), 10);

    if (isNaN(indice)) {
      console.error("ID de fila inválido:", idFila);
      return;
    }

    // Buscar la ruta por su índice original para obtener el ID real
    const rutaBuscada = rutasList?.datos[indice];

    if (!rutaBuscada) {
      console.error("No se encontró la ruta en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = rutaBuscada.id_rutas;

    try {
      // Obtener los datos completos y actualizados de la ruta
      const rutaCompleta = await getRutaById(idReal);

      if (rutaCompleta) {
        setRutaAEditar(rutaCompleta);
        setShowModalEditar(true);
      } else {
        console.error("No se pudo obtener la ruta completa");
        // Como fallback, usar los datos de la tabla
        setRutaAEditar(rutaBuscada);
        setShowModalEditar(true);
      }
    } catch (error) {
      console.error("Error al obtener la ruta completa:", error);
      // Como fallback, usar los datos de la tabla
      setRutaAEditar(rutaBuscada);
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

    // Buscar la ruta por su índice original para obtener el ID real
    const rutaBuscada = rutasList?.datos[indice];

    if (!rutaBuscada) {
      console.error("No se encontró la ruta en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = rutaBuscada.id_rutas;

    try {
      // Obtener los datos completos y actualizados de la ruta
      const rutaCompleta = await getRutaById(idReal);

      if (rutaCompleta) {
        setRutaSelecionada(rutaCompleta);
        setShowModalVer(true);
      } else {
        console.error("No se pudo obtener la ruta completa");
        // Como fallback, usar los datos de la tabla
        setRutaSelecionada(rutaBuscada);
        setShowModalVer(true);
      }
    } catch (error) {
      console.error("Error al obtener la ruta completa:", error);
      // Como fallback, usar los datos de la tabla
      setRutaSelecionada(rutaBuscada);
      setShowModalVer(true);
    }
  };

  return (
    <div className="flex px-12">
      <TablaGeneral
        data={rutasList?.datos || []}
        columns={rutasList?.columnas || []}
        refrescarTabla={refrescarTabla}
        AbrirModalEliminar={abrirModalEliminar}
        AbrirFormularioEditar={abrirModalEditar}
        AbrirModalVer={abrirModalVer}
        BotonAgregar={AgregarRuta}
      />

      <ConfirmarEliminar
        open={showModal}
        setOpen={setShowModal}
        onConfirm={() => handleEliminar(idRuta)}
        nombreRuta={nombreRuta}
      />
      <Toaster />
      {showModalEditar && rutaAEditar && (
        <FormularioEditarRuta
          open={showModalEditar}
          setOpen={setShowModalEditar}
          rutaAEditar={rutaAEditar}
          refrescarTabla={refrescarTabla}
        />
      )}

      {showModalVer && rutaSelecionada && (
        <ModalverRuta
          open={showModalVer}
          setOpen={setShowModalVer}
          rutaSeleccionada={rutaSelecionada}
        />
      )}
    </div>
  );
}
