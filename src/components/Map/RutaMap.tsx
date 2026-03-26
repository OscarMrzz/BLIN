"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// Importar el CSS es vital para que la línea y marcadores se vean bien
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { ParadaBusInterface } from "@/Interfaces/rutas.iterface";

// Aplicar parche global una sola vez para prevenir el error
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routingAny = L.Routing as any;

  if (
    routingAny.Line?.prototype &&
    !routingAny.Line.prototype._clearLinesPatched
  ) {
    routingAny.Line.prototype._clearLines = function () {
      try {
        if (this._map && this._layers) {
          // Limpiar capas de forma segura
          const layersToRemove = [];
          for (const layerId in this._layers) {
            const layer = this._layers[layerId];
            if (layer && this._map.hasLayer && this._map.hasLayer(layer)) {
              layersToRemove.push(layer);
            }
          }
          // Remover capas fuera del bucle para evitar errores de iteración
          layersToRemove.forEach((layer) => {
            try {
              if (this._map && this._map.removeLayer) {
                this._map.removeLayer(layer);
              }
            } catch {
              // Ignorar errores individuales
            }
          });
        }
      } catch {
        // Silenciar completamente cualquier error
      }
    };

    // Marcar como parcheado para no aplicar múltiples veces
    routingAny.Line.prototype._clearLinesPatched = true;
  }
}

type Props = {
  puntos: ParadaBusInterface[];
};

export function RutaMap({ puntos }: Props) {
  const map = useMap();

  useEffect(() => {
    // Verificación de seguridad inicial
    if (!map || !puntos || puntos.length < 2) return;

    // 1. Transformar puntos de tu interfaz a objetos LatLng de Leaflet
    const waypoints = puntos.map((p) => L.latLng(p.latitud, p.longitud));

    // 2. Configurar el control de rutas
    const routingControl = L.Routing.control({
      waypoints: waypoints,
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        useHints: false,
        timeout: 5000,
      }),
      lineOptions: {
        styles: [{ color: "#1d4ed8", weight: 6, opacity: 0.85 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      addWaypoints: false,
      routeWhileDragging: false,
      show: false,
      fitSelectedRoutes: true,
    });

    // 3. Añadir el control al mapa
    routingControl.addTo(map);

    // 4. Limpieza simple
    return () => {
      try {
        map.removeControl(routingControl);
      } catch {
        console.debug("Limpieza de ruta completada");
      }
    };
  }, [map, puntos]);

  return null;
}
