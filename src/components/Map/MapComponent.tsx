"use client";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import { useEffect, useRef } from "react";
import { puntoGeograficoInterface } from "@/Interfaces/rutas.iterface";

// Fix para iconos
if (typeof window !== "undefined") {
  const DefaultIcon = L.Icon.Default.prototype as L.Icon.Default & {
    _getIconUrl?: string;
  };
  delete DefaultIcon._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
}

type Props = {
  puntos: puntoGeograficoInterface[];
};

function Routing({ puntos }: Props) {
  const map = useMap();
  const routingRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !puntos || puntos.length === 0) return;

    // Filtrar puntos válidos
    const puntosValidos = puntos.filter(
      (punto) => punto && punto.latitud && punto.longitud,
    );
    if (puntosValidos.length === 0) return;

    const puntosClaves = puntosValidos.map((punto) =>
      L.latLng(punto.latitud, punto.longitud),
    );

    // Ajustar el mapa para mostrar todos los puntos
    if (puntosClaves.length > 0) {
      const bounds = L.latLngBounds(puntosClaves);
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    const routingControl = L.Routing.control({
      waypoints: puntosClaves,
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: false, // Desactivado porque usamos fitBounds manualmente
      show: false,
      containerClassName: "hidden",
      lineOptions: {
        extendToWaypoints: true,
        missingRouteTolerance: 0,
        // Azul fuerte para resaltar sobre el mapa claro
        styles: [{ color: "#1d4ed8", weight: 6, opacity: 0.85 }],
      },
    });

    try {
      routingControl.addTo(map);
      routingRef.current = routingControl;
    } catch (e) {
      console.warn("Error en routing:", e);
    }

    return () => {
      if (routingRef.current && map) {
        try {
          routingRef.current.setWaypoints([]);
          map.removeControl(routingRef.current);
        } catch {
          /* Silenciar error de limpieza */
        } finally {
          routingRef.current = null;
        }
      }
    };
  }, [map, puntos]);

  return null;
}

export default function MapComponent({ puntos }: Props) {
  // Validación más robusta
  if (!puntos || puntos.length === 0 || !puntos[0]) {
    return (
      <div
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          No hay coordenadas disponibles
        </div>
      </div>
    );
  }

  const center: [number, number] = [puntos[0].latitud, puntos[0].longitud];

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Estilo del mapa*/}
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
        <Routing puntos={puntos} />
      </MapContainer>
    </div>
  );
}
