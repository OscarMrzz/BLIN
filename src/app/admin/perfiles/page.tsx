"use client";
import { ConfirmarEliminar } from "@/components/Confirmacion/ConfirmarEliminar";
import { FormularioEditarPerfil } from "@/components/Formularios/pefiles/FormularioEditarPerfil";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { PerfilesInterface } from "@/Interfaces/roles.interface";
import {
  getAllPerfilesForTable,
  deletePerfil,
  getPerfilById,
} from "@/lib/services/perfilesServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import ModalVerPerfil from "@/components/Ver/ModalVerPerfil";
import { AgregarPerfil } from "@/components/Formularios/pefiles/FormularioAgregarPerfil";

export default function Page() {
  const { data: perfilesList, refetch } = useQuery({
    queryKey: ["getAllPerfilesForTable"],
    queryFn: getAllPerfilesForTable,
  });

  const refrescarTabla = () => {
    refetch();
  };

  const [showModal, setShowModal] = useState(false);
  const [showModalVer, setShowModalVer] = useState(false);
  const [perfilSeleccionado, setPerfilSeleccionado] =
    useState<PerfilesInterface | null>(null);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [perfilAEditar, setPerfilAEditar] = useState<PerfilesInterface | null>(
    null,
  );
  const [nombrePerfil, setNombrePerfil] = useState("");
  const [idPerfil, setIdPerfil] = useState("");

  const handleEliminar = async (id: string) => {
    try {
      await deletePerfil(id);
      toast.success("Perfil eliminado correctamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
    } catch (error) {
      console.error("Error al eliminar el perfil:", error);
      toast.error("Error al eliminar el perfil", {
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

    // Buscar el perfil por su índice original
    const perfilBuscado = perfilesList?.datos[indice];

    if (!perfilBuscado) {
      console.error("No se encontró el perfil en el índice:", indice);
      return;
    }

    // Obtener el ID real para la eliminación
    const idReal = perfilBuscado.id_perfiles;

    setNombrePerfil(
      perfilBuscado.nombre && perfilBuscado.apellido
        ? `${perfilBuscado.nombre} ${perfilBuscado.apellido}`
        : perfilBuscado.nombre || `Perfil ${idReal}`,
    );
    setIdPerfil(idReal);
    setShowModal(true);
  };

  const abrirModalEditar = async (idFila: string) => {
    // Extraer el índice del ID de TanStack Table (formato: "row-0", "row-1", etc.)
    const indice = parseInt(idFila.replace("row-", ""), 10);

    if (isNaN(indice)) {
      console.error("ID de fila inválido:", idFila);
      return;
    }

    // Buscar el perfil por su índice original para obtener el ID real
    const perfilBuscado = perfilesList?.datos[indice];

    if (!perfilBuscado) {
      console.error("No se encontró el perfil en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = perfilBuscado.id_perfiles;

    try {
      // Obtener los datos completos y actualizados del perfil
      const perfilCompleto = await getPerfilById(idReal);

      if (perfilCompleto) {
        setPerfilAEditar(perfilCompleto);
        setShowModalEditar(true);
      } else {
        console.error("No se pudo obtener el perfil completo");
        // Como fallback, usar los datos de la tabla
        setPerfilAEditar(perfilBuscado);
        setShowModalEditar(true);
      }
    } catch (error) {
      console.error("Error al obtener el perfil completo:", error);
      // Como fallback, usar los datos de la tabla
      setPerfilAEditar(perfilBuscado);
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

    // Buscar el perfil por su índice original para obtener el ID real
    const perfilBuscado = perfilesList?.datos[indice];

    if (!perfilBuscado) {
      console.error("No se encontró el perfil en el índice:", indice);
      return;
    }

    // Obtener el ID real para la consulta
    const idReal = perfilBuscado.id_perfiles;

    try {
      // Obtener los datos completos y actualizados del perfil
      const perfilCompleto = await getPerfilById(idReal);

      if (perfilCompleto) {
        setPerfilSeleccionado(perfilCompleto);
        setShowModalVer(true);
      } else {
        console.error("No se pudo obtener el perfil completo");
        // Como fallback, usar los datos de la tabla
        setPerfilSeleccionado(perfilBuscado);
        setShowModalVer(true);
      }
    } catch (error) {
      console.error("Error al obtener el perfil completo:", error);
      // Como fallback, usar los datos de la tabla
      setPerfilSeleccionado(perfilBuscado);
      setShowModalVer(true);
    }
  };

  return (
    <div className="flex px-12">
      <TablaGeneral
        data={perfilesList?.datos || []}
        columns={perfilesList?.columnas || []}
        refrescarTabla={refrescarTabla}
        AbrirModalEliminar={abrirModalEliminar}
        AbrirFormularioEditar={abrirModalEditar}
        AbrirModalVer={abrirModalVer}
        BotonAgregar={AgregarPerfil}
      />

      <ConfirmarEliminar
        open={showModal}
        setOpen={setShowModal}
        onConfirm={() => handleEliminar(idPerfil)}
        nombreRuta={nombrePerfil}
      />
      <Toaster />
      {showModalEditar && perfilAEditar && (
        <FormularioEditarPerfil
          open={showModalEditar}
          setOpen={setShowModalEditar}
          refrescarTabla={refrescarTabla}
          perfilAEditar={perfilAEditar}
        />
      )}

      {showModalVer && perfilSeleccionado && (
        <ModalVerPerfil
          open={showModalVer}
          setOpen={setShowModalVer}
          perfilSeleccionado={perfilSeleccionado}
        />
      )}
    </div>
  );
}
