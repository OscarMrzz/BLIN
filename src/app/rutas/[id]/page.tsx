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

    const { data: ruta ,isLoading,isError,error } = useQuery({ queryKey: ['rutaBuscada'], queryFn: () => getRutaById(id) })


    if (isLoading) {
      return <div>Cargando...</div>
    }
    
    if (isError) {
      return <div>Error</div>
    }
    
      

  return (
    <div className="p-4 w-full ">
      <h2 className="text-2xl font-black text-slate-600 mb-4 ">
        SPS - El progreso
      </h2>

      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg w-full">
        {/* 2. Colocación del componente */}
        <MapComponent puntos={ruta?.paradasRuta || []}  />
      </div>
    </div>
  );
}
