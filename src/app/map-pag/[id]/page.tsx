"use client";

import { NuevoMapa } from "@/components/Map/NuevoMapa";
import { ParadasDetalladasInterface } from "@/Interfaces/rutas.interface";
import { getRutaById } from "@/lib/services/rutasServices";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
import React, { useEffect } from "react";
type Props = {
  params: Promise<{ id: string }>;
};

interface MapData {
  start: { name: string; lng: number; lat: number };
  end: { name: string; lng: number; lat: number };
}
export default function Page({ params }: Props) {
  const [ruta, setRuta] = React.useState<ParadasDetalladasInterface>();
  const { miUbicacion } = miUbicacionStore();

  const [mapData, setMapData] = React.useState<MapData | null>(null);
  const { id } = React.use(params);
  useEffect(() => {
    const fetchRuta = async () => {
      const ruta = await getRutaById(id);
      setRuta(ruta);
      setMapData({
        start: {
          name: ruta.origen,
          lng: ruta.punto_origen.longitud,
          lat: ruta.punto_origen.latitud,
        },
        end: {
          name: ruta.destino,
          lng: ruta.punto_destino.longitud,
          lat: ruta.punto_destino.latitud,
        },
      });
    };
    fetchRuta();
  }, [id]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-600">{ruta?.nombre}</h2>
      <NuevoMapa
        start={mapData?.start}
        end={mapData?.end}
        miPisicion={
          miUbicacion
            ? {
                name: "Mi ubicación",
                lng: miUbicacion.longitud || 0,
                lat: miUbicacion.latitud,
              }
            : undefined
        }
      />
    </div>
  );
}
