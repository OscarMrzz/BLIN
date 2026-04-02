"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import { RutaMap } from "./RutaMap";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
import { LocalizacionUsuario } from "./LocalizacionUsuario";
import { ParadaBusInterface } from "@/Interfaces/rutas.iterface";

// Fix para iconos
if (typeof window !== "undefined") {
  const DefaultIcon = L.Icon.Default.prototype as L.Icon.Default & {
    _getIconUrl?: string;
  };
  delete DefaultIcon._getIconUrl;
  // Mismo origen que la app (evita "Tracking Prevention" de Edge con unpkg.com)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  });
}

type Props = {
  puntos: ParadaBusInterface[];
};

export default function MapComponent({ puntos }: Props) {
  const { miUbicacion } = miUbicacionStore();
  // Validación más robusta
  if (!puntos || puntos.length === 0) {
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

  // Usar el primer punto de la ruta como centro si no hay ubicación del usuario
  const center: [number, number] = miUbicacion
    ? [miUbicacion.latitud, miUbicacion.longitud]
    : [puntos[0].latitud, puntos[0].longitud];

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
          /*           url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" */
          url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_STADIA_API_KEY}`}
        />
        <LocalizacionUsuario />
        <RutaMap puntos={puntos} />
      </MapContainer>
    </div>
  );
}
