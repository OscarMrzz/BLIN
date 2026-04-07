"use client";
import React from "react";
import dynamic from "next/dynamic";

import { vista_completa_rutas_byid } from "@/lib/services/rutasServices";
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
    data: rutas,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rutaBuscada", id],
    queryFn: () => vista_completa_rutas_byid(id),
  });

  // vista_completa_rutas_byid devuelve un array, tomamos el primer elemento
  const ruta = rutas?.[0];

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message || "Error desconocido"}</div>;
  }

  if (!ruta) {
    return <div>Ruta no encontrada</div>;
  }

  // Validar que las coordenadas sean válidas
  if (!ruta.latitud || !ruta.longitud) {
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

  // Crear objeto con punto de inicio y final para el mapa
  const puntosRuta = {
    inicio: {
      id_paradas: ruta.id_paradas,
      latitud: Number(ruta.latitud),
      longitud: Number(ruta.longitud),
      nombre_lugar: ruta.origen,
    },
    final: {
      id_paradas: `${ruta.id_paradas}_final`,
      latitud: Number(ruta.latitud) + 0.01, // Pequeño desplazamiento para visualización
      longitud: Number(ruta.longitud) + 0.01,
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
