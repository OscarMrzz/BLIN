"use client";
import React from "react";
import dynamic from "next/dynamic";

import { getRutaById } from "@/services/rutasServices";
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
    data: ruta,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rutaBuscada"],
    queryFn: () => {
      console.log("🚀 [QUERY] Ejecutando getRutaById con ID:", id);
      return getRutaById(id);
    },
  });

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
  console.log(" [RENDER] Paradas para el mapa:", ruta?.parada_ruta);

  return (
    <div className="p-4 w-full ">
      <h2 className="text-2xl font-black text-slate-600 mb-4 ">
        {ruta?.nombre || "Ruta no encontrada"}
      </h2>

      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg w-full">
        {/* 2. Colocación del componente */}
        <MapComponent puntos={ruta?.parada_ruta || []} />
      </div>
    </div>
  );
}
