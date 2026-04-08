"use client";
import React from "react";
import dynamic from "next/dynamic";

import { getRutaById } from "@/lib/services/rutasServices";
import { useQuery } from "@tanstack/react-query";

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

  const {
    data: ruta,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rutaBuscada", id],
    queryFn: () => getRutaById(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col px-2">
        <h2 className="text-2xl font-black text-slate-600 mb-4">Cargando...</h2>
        <div className="w-full h-120 rounded-2xl shadow bg-slate-50"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message || "Error desconocido"}</div>;
  }

  if (!ruta) {
    return <div>Ruta no encontrada</div>;
  }

  // Validar que las coordenadas sean válidas
  if (
    !ruta.punto_origen?.latitud ||
    !ruta.punto_origen?.longitud ||
    !ruta.punto_destino?.latitud ||
    !ruta.punto_destino?.longitud
  ) {
    return (
      <div className="p-4 w-full">
        <h2 className="text-2xl font-black text-slate-600 mb-4">
          {ruta.nombre || "Ruta no encontrada"}
        </h2>
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg w-full p-8 text-center">
          <p className="text-red-500">
            Las coordenadas de la ruta no están disponibles
          </p>
        </div>
      </div>
    );
  }

  // Crear objeto con punto de inicio y final para el mapa usando coordenadas reales
  const puntosRuta = {
    inicio: {
      id_paradas: ruta.id_rutas + "_origen",
      latitud: Number(ruta.punto_origen.latitud),
      longitud: Number(ruta.punto_origen.longitud),
      nombre_lugar: ruta.origen,
    },
    final: {
      id_paradas: ruta.id_rutas + "_destino",
      latitud: Number(ruta.punto_destino.latitud),
      longitud: Number(ruta.punto_destino.longitud),
      nombre_lugar: ruta.destino,
    },
  };

  // Convertir a array para el MapComponent
  const puntosMapa = [puntosRuta.inicio, puntosRuta.final];

  return (
    <div className="p-4 w-full ">
      <h2 className="text-2xl font-black text-slate-600 mb-4 ">
        {ruta?.nombre || "Ruta no encontrada"}
      </h2>

      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg w-full">
        {/* 2. Colocación del componente */}
        <MapComponent puntos={puntosMapa} />
      </div>
    </div>
  );
}
