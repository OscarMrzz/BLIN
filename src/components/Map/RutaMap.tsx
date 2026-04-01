"use client";

import { useEffect, useRef, useState } from "react";
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
  const [mapReady, setMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    // Esperar a que el mapa esté completamente inicializado
    const checkMapReady = () => {
      if (
        map &&
        map.getContainer() &&
        (map as unknown as { _loaded?: boolean })._loaded
      ) {
        setMapReady(true);
      } else if (map) {
        // Reintentar después de un pequeño delay
        setTimeout(checkMapReady, 100);
      }
    };

    checkMapReady();
  }, [map]);

  useEffect(() => {
    // Solo ejecutar si el mapa está listo y hay puntos válidos
    if (!mapReady || !map || !puntos || puntos.length < 2) return;

    const initializeRouting = async () => {
      try {
        // Limpiar errores anteriores de forma asíncrona
        setError(null);

        // 1. Transformar puntos de tu interfaz a objetos LatLng de Leaflet
        const waypoints = puntos.map((p) => L.latLng(p.latitud, p.longitud));

        // 2. Configurar el control de rutas
        const routingControl = L.Routing.control({
          waypoints: waypoints,
          router: L.Routing.osrmv1({
            // NUEVA CONFIGURACIÓN: Servidor local en Docker (Honduras)
            serviceUrl: process.env.NEXT_PUBLIC_OSRM_URL,

            /* CÓDIGO ANTERIOR (SERVIDOR DEMO):
            serviceUrl: "https://router.project-osrm.org/route/v1",
            */

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
        routingControlRef.current = routingControl;

        // 4. Ocultar las instrucciones de ruta con CSS
        setTimeout(() => {
          const routingContainer = map.getContainer();
          if (routingContainer) {
            const style = document.createElement("style");
            style.textContent = `
              .leaflet-routing-container,
              .leaflet-routing-error {
                display: none !important;
              }
            `;
            document.head.appendChild(style);
          }
        }, 100);

        // Manejar errores del routing
        routingControl.on(
          "routingerror",
          (e: { error?: { message?: string } }) => {
            const errorMessage =
              e.error?.message || "Error al calcular la ruta";
            console.error("Error de routing:", errorMessage);
            setError(`No se pudo calcular la ruta: ${errorMessage}`);
          },
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        console.error("Error al inicializar la ruta:", errorMessage);
        setError(`Error al cargar la ruta: ${errorMessage}`);
      }
    };

    initializeRouting();

    // 5. Limpieza
    return () => {
      if (routingControlRef.current && map) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (cleanupError) {
          console.debug("Error en limpieza de routing control:", cleanupError);
        }
        routingControlRef.current = null;
      }
    };
  }, [mapReady, map, puntos]);

  // Mostrar error controlado si hay alguno
  if (error) {
    return (
      <div className="absolute top-4 left-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-1000 max-w-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold">Error en la ruta</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
