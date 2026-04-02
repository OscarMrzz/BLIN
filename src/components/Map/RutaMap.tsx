"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

// Importar el CSS es vital para que la línea y marcadores se vean bien
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

import { ParadaBusInterface } from "@/Interfaces/rutas.iterface";
import {
  formatRoutingError,
  formatRoutingErrorLogBlock,
  RUTA_MAP_LOG_PREFIX,
} from "@/utils/routing/formatRoutingError";
import {
  buildOsrmEndpointList,
  createOsrmFallbackRouter,
} from "@/utils/routing/osrmFallbackRouter";

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
    if (!map) return;
    let cancelled = false;
    const m = map as L.Map;
    const markReady = () => {
      if (!cancelled) setMapReady(true);
    };
    // whenReady evita depender solo de _loaded con polling; el mapa dispara una sola vez al estar listo
    if ((m as unknown as { _loaded?: boolean })._loaded) {
      markReady();
    } else {
      m.whenReady(markReady);
    }
    return () => {
      cancelled = true;
    };
  }, [map]);

  useEffect(() => {
    if (!mapReady || !map) return;
    if (!puntos || puntos.length < 2) {
      if (puntos && puntos.length === 1) {
        console.log(
          RUTA_MAP_LOG_PREFIX,
          "Enrutado OSRM omitido: hace falta al menos 2 paradas para trazar ruta (hay 1).",
        );
      }
      return;
    }

    const initializeRouting = async () => {
      try {
        // Limpiar errores anteriores de forma asíncrona
        setError(null);

        // Enrutado OSRM v5: NEXT_PUBLIC_OSRM_URL (servidor principal, p. ej. https://tu-host/route/v1),
        // NEXT_PUBLIC_OSRM_FALLBACK_URL (segundo servidor opcional, mismo formato), y como tercer
        // intento el demo router.project-osrm.org (solo respaldo; ver buildOsrmEndpointList).
        const endpoints = buildOsrmEndpointList();
        if (endpoints.length === 0) {
          const msg =
            "No hay ninguna URL OSRM válida. Define NEXT_PUBLIC_OSRM_URL (p. ej. https://tu-servidor/route/v1) o NEXT_PUBLIC_OSRM_FALLBACK_URL.";
          console.error(RUTA_MAP_LOG_PREFIX, msg);
          setError(msg);
          return;
        }

        console.log(
          RUTA_MAP_LOG_PREFIX,
          "🚀 Iniciando proceso de enrutamiento OSRM",
        );
        console.log(
          RUTA_MAP_LOG_PREFIX,
          `📍 Puntos a procesar: ${puntos.length} paradas`,
        );
        console.log(
          RUTA_MAP_LOG_PREFIX,
          `🔧 Motores OSRM disponibles: ${endpoints.length}`,
        );
        console.log(
          RUTA_MAP_LOG_PREFIX,
          `📋 Orden de intento: ${endpoints.map((e) => `${e.label} (${e.serviceUrl})`).join(" → ")}`,
        );

        // 1. Transformar puntos de tu interfaz a objetos LatLng de Leaflet
        console.log(
          RUTA_MAP_LOG_PREFIX,
          "🔄 Transformando coordenadas de paradas...",
        );
        const waypoints = puntos.map((p) => {
          const latLng = L.latLng(p.latitud, p.longitud);
          console.log(
            RUTA_MAP_LOG_PREFIX,
            `   📍 Parada: ${p.nombreLugar || "Sin nombre"} → [${p.latitud.toFixed(6)}, ${p.longitud.toFixed(6)}]`,
          );
          return latLng;
        });
        console.log(
          RUTA_MAP_LOG_PREFIX,
          `✅ Coordenadas listas: ${waypoints.length} waypoints`,
        );

        // 2. Configurar el control de rutas (varios OSRM en cadena)
        console.log(
          RUTA_MAP_LOG_PREFIX,
          "⚙️ Configurando control de enrutamiento...",
        );
        const routingControl = L.Routing.control({
          waypoints: waypoints,
          router: createOsrmFallbackRouter(endpoints),
          lineOptions: {
            styles: [{ color: "#1d4ed8", weight: 6, opacity: 0.85 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          addWaypoints: false,
          routeWhileDragging: false,
          show: false,
          fitSelectedRoutes: true,
          defaultErrorHandler(ev: { error?: unknown }) {
            console.error(formatRoutingErrorLogBlock(ev.error));
          },
        });

        // 3. Añadir el control al mapa
        console.log(
          RUTA_MAP_LOG_PREFIX,
          "🗺️ Añadiendo control de ruta al mapa...",
        );
        routingControl.addTo(map);
        routingControlRef.current = routingControl;
        console.log(
          RUTA_MAP_LOG_PREFIX,
          "✅ Control de ruta añadido exitosamente",
        );

        // 4. Ocultar las instrucciones de ruta con CSS
        console.log(
          RUTA_MAP_LOG_PREFIX,
          "🎨 Aplicando estilos para ocultar instrucciones...",
        );
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
          console.log(
            RUTA_MAP_LOG_PREFIX,
            "✅ Estilos aplicados correctamente",
          );
        }, 100);

        routingControl.on("routingerror", (e: { error?: unknown }) => {
          console.log(
            RUTA_MAP_LOG_PREFIX,
            "❌ Evento de error de enrutamiento recibido",
          );
          const formatted = formatRoutingError(e.error);
          console.log(
            RUTA_MAP_LOG_PREFIX,
            `📄 Error formateado: ${formatted.tipoFallo}`,
          );
          setError(
            `${formatted.resumenUsuario} ${formatted.sugerencias.join(" ")}`,
          );
        });

        console.log(
          RUTA_MAP_LOG_PREFIX,
          "🎉 Configuración de enrutamiento completada",
        );
      } catch (err) {
        console.log(
          RUTA_MAP_LOG_PREFIX,
          "💥 Error capturado en initializeRouting",
        );
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        console.error(
          RUTA_MAP_LOG_PREFIX,
          "🔍 Detalles del error:",
          errorMessage,
        );
        console.error(
          RUTA_MAP_LOG_PREFIX,
          "🔍 Stack trace:",
          err instanceof Error ? err.stack : "No disponible",
        );
        setError(`Error al cargar la ruta: ${errorMessage}`);
      }
    };

    initializeRouting();

    // 5. Limpieza
    return () => {
      console.log(RUTA_MAP_LOG_PREFIX, "🧹 Iniciando limpieza de recursos...");
      if (routingControlRef.current && map) {
        try {
          console.log(
            RUTA_MAP_LOG_PREFIX,
            "🗑️ Removiendo control de ruta del mapa...",
          );
          map.removeControl(routingControlRef.current);
          console.log(
            RUTA_MAP_LOG_PREFIX,
            "✅ Control de ruta removido exitosamente",
          );
        } catch (cleanupError) {
          console.error(
            RUTA_MAP_LOG_PREFIX,
            "⚠️ Error en limpieza de routing control:",
            cleanupError,
          );
        }
        routingControlRef.current = null;
      }
      console.log(RUTA_MAP_LOG_PREFIX, "🧼 Limpieza de recursos completada");
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
