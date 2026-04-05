import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Icono personalizado para que se vea diferente a los puntos de la ruta
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Puedes usar un SVG o PNG local
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

export function LocalizacionUsuario() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    // 1. Pedir la ubicación al navegador
    map.locate({ setView: false, watch: true }); // 'watch' sigue al usuario si se mueve

    // 2. Evento cuando se encuentra la ubicación
    map.on("locationfound", (e) => {
      setPosition(e.latlng);
      // Opcional: Centrar el mapa en el usuario la primera vez
      // map.flyTo(e.latlng, map.getZoom());
    });

    // 3. Manejo de errores
    map.on("locationerror", () => {
      console.error("No se pudo obtener la ubicación");
    });

    return () => {
      map.stopLocate();
      map.off("locationfound");
      map.off("locationerror");
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>Estás aquí</Popup>
    </Marker>
  );
}
