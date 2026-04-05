import { StoppingInterface, ParadasDetalladasInterface } from "@/Interfaces/rutas.interface";

interface UbicacionInterface {
  latitud: number;
  longitud: number;
}

export const obtenerDistanciaCarretera = async (
  miUbicacion: UbicacionInterface,
  origenRuta: UbicacionInterface
): Promise<number> => {
  // Primero intentar con cálculo local para evitar problemas de red
  console.log("Calculando distancia entre:", miUbicacion, origenRuta);

  try {
    // Intentar OSRM API con configuración mejorada
    const url = `https://router.project-osrm.org/route/v1/driving/${origenRuta.longitud},${origenRuta.latitud};${miUbicacion.longitud},${miUbicacion.latitud}?overview=false`;

    console.log("Intentando OSRM API...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Reducido a 5 segundos

    const respuesta = await fetch(url, {
      method: 'GET',
      mode: 'cors', // Explícitamente CORS
      cache: 'no-cache', // Evitar caché
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (respuesta.ok) {
      const datos = await respuesta.json();
      if (datos.code === 'Ok' && datos.routes && datos.routes[0]) {
        const distanciaKm = datos.routes[0].distance / 1000;
        console.log("✅ Distancia OSRM:", distanciaKm, "km");
        return distanciaKm;
      }
    }
  } catch (error) {
    console.log("❌ OSRM API falló, usando cálculo local:", error);
  }

  // Siempre usar Haversine como fallback principal
  return obtenerDistanciaCarreteraFallback(miUbicacion, origenRuta);
};

// Función principal de cálculo usando Haversine
const obtenerDistanciaCarreteraFallback = (
  miUbicacion: UbicacionInterface,
  origenRuta: UbicacionInterface
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (miUbicacion.latitud - origenRuta.latitud) * Math.PI / 180;
  const dLon = (miUbicacion.longitud - origenRuta.longitud) * Math.PI / 180;
  const lat1 = origenRuta.latitud * Math.PI / 180;
  const lat2 = miUbicacion.latitud * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c;

  console.log("📍 Distancia calculada (Haversine):", distancia.toFixed(2), "km");
  return distancia;
};


export const obtenerMinutosParaLlegada = (
  miParada: StoppingInterface,
  ruta: ParadasDetalladasInterface
): number | null => {
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  // 1. Tiempo que le toma al bus llegar de la terminal a MI parada
  // (Distancia / Velocidad) * 60 para pasar a minutos
  const distancia = miParada.distancia_desde_origen || 0;
  const tiempoTransito = (distancia / ruta.velocidad) * 60;

  // 2. Como no tenemos horarios_ruta en ParadasDetalladasInterface, 
  // devolvemos solo el tiempo de tránsito estimado
  console.log("⏰ Tiempo de tránsito estimado:", tiempoTransito, "minutos");

  // Para simplificar, asumimos que hay un bus cada 30 minutos
  const intervaloBuses = 30;
  const proximoBus = Math.ceil((minutosActuales % intervaloBuses) + tiempoTransito);

  return proximoBus;
};

export function ObtenerhoraProximoBus(minutos: number) {

  const diaActual = new Date()
  const horaActual = diaActual.getHours()
  const minutosActuales = diaActual.getMinutes()

  const minutosTotalDia = (horaActual * 60) + minutosActuales

  const minutosProximoBus = minutosTotalDia + minutos

  const horaSimple = Math.floor(minutosProximoBus / 60)
  const minutosSimples = minutosProximoBus % 60

  const horaFormato12 = horaSimple > 12 ? horaSimple - 12 : horaSimple



  const datoTotalADevolver = `${horaFormato12 < 10 ? "0" : ""}${horaFormato12}:${minutosSimples < 10 ? "0" : ""}${minutosSimples} ${horaSimple < 12 ? "AM" : "PM"}`
  return datoTotalADevolver


}
