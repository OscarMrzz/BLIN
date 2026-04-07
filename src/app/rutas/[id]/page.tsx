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
  console.log("🔍 [ID PAGE] ID recibido:", id);

  const {
    data: rutas,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rutaBuscada", id],
    queryFn: () => {
      console.log(
        "🚀 [QUERY] Ejecutando vista_completa_rutas_byid con ID:",
        id,
      );
      return vista_completa_rutas_byid(id);
    },
  });

  // vista_completa_rutas_byid devuelve un array, tomamos el primer elemento
  const ruta = rutas?.[0];

  console.log(
    "📊 [QUERY] Estado - isLoading:",
    isLoading,
    "isError:",
    isError,
    "error:",
    error,
  );
  console.log("📦 [QUERY] Datos recibidos:", ruta);

  if (isLoading) {
    console.log("⏳ [RENDER] Mostrando pantalla de carga");
    return <div>Cargando...</div>;
  }

  if (isError) {
    console.log(" [RENDER] Mostrando pantalla de error:", error);
    return <div>Error: {error?.message || "Error desconocido"}</div>;
  }

  console.log(" [RENDER] Renderizando página con ruta:", ruta);
  console.log(" [RENDER] Coordenadas para el mapa:", ruta);

  // Crear un array con el punto de la ruta para el mapa
  const puntosMapa = ruta
    ? [
        {
          id_paradas: ruta.id_paradas,
          latitud: ruta.latitud,
          longitud: ruta.longitud,
          nombre_lugar: ruta.nombre,
        },
      ]
    : [];

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
