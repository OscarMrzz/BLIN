"use client";

import { NuevoMapa } from "@/components/Map/NuevoMapa";
import {
  ParadasDetalladasInterface,
  StoppingInterface,
} from "@/Interfaces/rutas.interface";
import { getRutaById } from "@/lib/services/rutasServices";
import { getParadaByIdRuta } from "@/lib/services/ParadasServices";
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
      try {
        console.log(" [MAPA PAGE] Iniciando obtención de ruta");
        console.log(" [MAPA PAGE] ID recibido:", id);

        // Obtener ruta básica
        const ruta = await getRutaById(id);
        console.log(" [MAPA PAGE] Ruta básica obtenida:", ruta);

        if (!ruta) {
          console.error(" [MAPA PAGE] No se encontró la ruta con ID:", id);
          return;
        }

        // Obtener paradas usando getParadaByIdRuta directamente
        console.log(" [MAPA PAGE] Obteniendo paradas con getParadaByIdRuta...");
        const paradas = await getParadaByIdRuta(id);

        console.log(" [MAPA PAGE] Paradas obtenidas:", paradas);
        console.log(" [MAPA PAGE] Número de paradas:", paradas?.length || 0);

        if (!paradas || paradas.length === 0) {
          console.error(" [MAPA PAGE] No se encontraron paradas para la ruta");
          return;
        }

        // Ordenar paradas por distancia_desde_origen
        const paradasOrdenadas = paradas.sort(
          (a: StoppingInterface, b: StoppingInterface) =>
            (a.distancia_desde_origen || 0) - (b.distancia_desde_origen || 0),
        );

        console.log(" [MAPA PAGE] Paradas ordenadas:", paradasOrdenadas);

        // Usar primera y última parada
        const primeraParada = paradasOrdenadas[0];
        const ultimaParada = paradasOrdenadas[paradasOrdenadas.length - 1];

        console.log(" [MAPA PAGE] Primera parada (origen):", primeraParada);
        console.log(" [MAPA PAGE] Última parada (destino):", ultimaParada);

        // Crear datos del mapa
        const newMapData = {
          start: {
            name: primeraParada.nombre_lugar || ruta.origen || "Origen",
            lng: primeraParada.longitud,
            lat: primeraParada.latitud,
          },
          end: {
            name: ultimaParada.nombre_lugar || ruta.destino || "Destino",
            lng: ultimaParada.longitud,
            lat: ultimaParada.latitud,
          },
        };

        console.log("✅ [MAPA PAGE] Datos del mapa preparados:");
        console.log(JSON.stringify(newMapData, null, 2));
        console.log("📍 [MAPA PAGE] Coordenada de inicio:", newMapData.start);
        console.log("📍 [MAPA PAGE] Coordenada de fin:", newMapData.end);

        setRuta(ruta);
        setMapData(newMapData);
      } catch (error) {
        console.error("💥 [MAPA PAGE] Error en fetchRuta:", error);
      }
    };

    if (id) {
      fetchRuta();
    } else {
      console.error("❌ [MAPA PAGE] No hay ID disponible");
    }
  }, [id]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-600">{ruta?.nombre}</h2>

      {!mapData ? (
        <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500">No hay coordenadas disponibles</p>
            <p className="text-sm text-gray-400 mt-2">
              {ruta
                ? "La ruta no tiene puntos de origen/destino válidos"
                : "Cargando ruta..."}
            </p>
          </div>
        </div>
      ) : (
        <NuevoMapa
          start={mapData.start}
          end={mapData.end}
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
      )}
    </div>
  );
}
