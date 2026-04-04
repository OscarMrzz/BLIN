"use client";
import { ConfirmarEliminar } from "@/components/Confirmacion/ConfirmarEliminar";
import { FormularioEditarStopping } from "@/components/Formularios/Stopping/FormularioEditarStopping";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { StoppingInterface } from "@/Interfaces/rutas.interface";
import {
  getAllParadasForTable,
  deleteParada,
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

  const abrirModalEliminar = (idParada: string) => {
    const paradaBuscada = paradasList?.datos.find(
      (parada) => parada.id_paradas === idParada,
    );

    setNombreParada(paradaBuscada?.nombre_lugar || "");
    setIdParada(idParada);
    setShowModal(true);
  };

  const abrirModalEditar = (datosAEditar: StoppingInterface) => {
    setParadaAEditar(datosAEditar);

    setShowModalEditar(true);
  };

  const abrirModalVer = (datosAVer: StoppingInterface) => {
    setParadaSeleccionada(datosAVer);
    setShowModalVer(true);
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
