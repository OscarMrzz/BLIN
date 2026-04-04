"use client";
import { ConfirmarEliminar } from "@/components/Confirmacion/ConfirmarEliminar";
import { EditarHorario } from "@/components/Formularios/horarios/FormularioEditarHorario";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { HorariosInterface } from "@/Interfaces/rutas.interface";
import {
  getAllHorariosForTable,
  deleteHorario,
  getHorarioById,
} from "@/lib/services/horariosServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import ModalVerHorario from "@/components/Ver/ModalVerHorario";
import { AgregarHorario } from "@/components/Formularios/horarios/FormularioAgregarHorario";

export default function Page() {
  const { data: horariosList, refetch } = useQuery({
    queryKey: ["getAllHorariosForTable"],
    queryFn: getAllHorariosForTable,
  });

  const refrescarTabla = () => {
    refetch();
  };

  const [showModal, setShowModal] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] =
    useState<HorariosInterface | null>(null);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [horarioAEditar, setHorarioAEditar] =
    useState<HorariosInterface | null>(null);
  const [nombreHorario, setNombreHorario] = useState("");
  const [idHorario, setIdHorario] = useState("");

  const handleEliminar = async (id: string) => {
    try {
      console.log("Iniciando eliminación del horario con ID:", id);
      await deleteHorario(id);
      toast.success("Horario eliminado correctamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
    } catch (error) {
      console.error("Error al eliminar el horario:", error);

      // Mostrar mensaje de error más específico
      let errorMessage = "Error al eliminar el horario";
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

    // Buscar el horario por su índice original
    const horarioBuscado = horariosList?.datos[indice];

    if (!horarioBuscado) {
      console.error("No se encontró el horario en el índice:", indice);
      return;
    }

    // Obtener el ID real para la eliminación
    const idReal = horarioBuscado.id_horarios;

    setNombreHorario(`Horario #${horarioBuscado.horario || ""}`);
    setIdHorario(idReal);
    setShowModal(true);
  };

  const abrirModalEditar = async (idFila: string) => {
    // Extraer el índice del ID de TanStack Table (formato: "row-0", "row-1", etc.)
    const indice = parseInt(idFila.replace("row-", ""), 10);

    if (isNaN(indice)) {
      console.error("ID de fila inválido:", idFila);
      return;
    }

    // Buscar el horario por su índice original para obtener el ID real
    const horarioBuscado = horariosList?.datos[indice];

    if (!horarioBuscado) {
      console.error("No se encontró el horario en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = horarioBuscado.id_horarios;

    try {
      // Obtener los datos completos y actualizados del horario
      const horarioCompleto = await getHorarioById(idReal);

      if (horarioCompleto) {
        setHorarioAEditar(horarioCompleto);
        setShowModalEditar(true);
      } else {
        console.error("No se pudo obtener el horario completo");
        // Como fallback, usar los datos de la tabla
        setHorarioAEditar(horarioBuscado);
        setShowModalEditar(true);
      }
    } catch (error) {
      console.error("Error al obtener el horario completo:", error);
      // Como fallback, usar los datos de la tabla
      setHorarioAEditar(horarioBuscado);
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

    // Buscar el horario por su índice original para obtener el ID real
    const horarioBuscado = horariosList?.datos[indice];

    if (!horarioBuscado) {
      console.error("No se encontró el horario en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = horarioBuscado.id_horarios;

    try {
      // Obtener los datos completos y actualizados del horario
      const horarioCompleto = await getHorarioById(idReal);

      if (horarioCompleto) {
        setHorarioSeleccionado(horarioCompleto);
        setShowModalVer(true);
      } else {
        console.error("No se pudo obtener el horario completo");
        // Como fallback, usar los datos de la tabla
        setHorarioSeleccionado(horarioBuscado);
        setShowModalVer(true);
      }
    } catch (error) {
      console.error("Error al obtener el horario completo:", error);
      // Como fallback, usar los datos de la tabla
      setHorarioSeleccionado(horarioBuscado);
      setShowModalVer(true);
    }
  };

  return (
    <div className="flex px-12">
      <TablaGeneral
        data={horariosList?.datos || []}
        columns={horariosList?.columnas || []}
        refrescarTabla={refrescarTabla}
        AbrirModalEliminar={abrirModalEliminar}
        AbrirFormularioEditar={abrirModalEditar}
        AbrirModalVer={abrirModalVer}
        BotonAgregar={AgregarHorario}
      />

      <ConfirmarEliminar
        open={showModal}
        setOpen={setShowModal}
        onConfirm={() => handleEliminar(idHorario)}
        nombreRuta={nombreHorario}
      />
      <Toaster />
      {showModalEditar && horarioAEditar && (
        <EditarHorario
          open={showModalEditar}
          setOpen={setShowModalEditar}
          refrescarTabla={refrescarTabla}
          horarioAEditar={horarioAEditar}
        />
      )}

      {showModalVer && horarioSeleccionado && (
        <ModalVerHorario
          open={showModalVer}
          setOpen={setShowModalVer}
          horarioSeleccionado={horarioSeleccionado}
        />
      )}
    </div>
  );
}
