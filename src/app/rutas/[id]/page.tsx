"use client";
import React from "react";
import dynamic from "next/dynamic";
import { PuntoGeograficoInterface } from "@/Interfaces/puntosCordenadas.interface";

const MapComponent = dynamic(() => import("@/components/Map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-100 animate-pulse flex items-center justify-center">
      Cargando mapa...
    </div>
  ),
});
type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const { id } = React.use(params);

  // Datos de prueba (aquí deberías obtener los puntos según el id)
  const puntosPrueba: PuntoGeograficoInterface = {
    origen: {
      lat: 15.50417, // San Pedro Sula
      lng: -88.025,
    },
    destino: {
      lat: 15.5, // Otro punto cercano
      lng: -88.0,
    },
  };

  return (
    <div className="p-4 w-full ">
      <h2 className="text-2xl font-black text-slate-600 mb-4 ">
        SPS - El progreso
      </h2>

      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg w-full">
        {/* 2. Colocación del componente */}
        <MapComponent puntos={puntosPrueba} />
      </div>
    </div>
  );
}
