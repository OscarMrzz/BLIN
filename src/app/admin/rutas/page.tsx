"use client";
import { ConfirmarEliminar } from "@/components/Confirmacion/ConfirmarEliminar";
import { FormularioEditarRuta } from "@/components/Formularios/Rutas/FormularioEditarRuta";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { RutasInterface } from "@/Interfaces/rutas.interface";
import { getAllRutasForTable, deleteRuta } from "@/lib/services/rutasServices";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function Page() {
  const { data: rutasList, refetch } = useQuery({
    queryKey: ["getAllRutasForTable"],
    queryFn: getAllRutasForTable,
  });

  const refrescarTabla = () => {
    refetch();
  };

  const [showModal, setShowModal] = useState(false);
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

  const abrirModalEliminar = (idRuta: string, nombreRuta: string) => {
    console.log("Abriendo modal para eliminar:", nombreRuta);
    setNombreRuta(nombreRuta);
    setIdRuta(idRuta);
    setShowModal(true);
  };

  const abrirModalEditar = (datosAEditar: RutasInterface) => {
    setRutaAEditar(datosAEditar);

    setShowModalEditar(true);
  };

  return (
    <div className="flex px-12">
      <TablaGeneral
        data={rutasList?.datos || []}
        columns={rutasList?.columnas || []}
        onClickAgregar={() => {}}
        refrescarTabla={refrescarTabla}
        AbrirModalEliminar={abrirModalEliminar}
        AbrirFormularioEditar={abrirModalEditar}
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
    </div>
  );
}
