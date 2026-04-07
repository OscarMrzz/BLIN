import { StoppingInterface, RutaCompletaInterface } from "@/Interfaces/rutas.interface";

interface UbicacionInterface {
  latitud: number;
  longitud: number;
}

export const obtenerDistanciaCarretera = async (
  miUbicacion: UbicacionInterface,
  origenRuta: UbicacionInterface
): Promise<number> => {
  try {
    // Intentar OSRM API con configuración mejorada
    const url = `https://router.project-osrm.org/route/v1/driving/${origenRuta.longitud},${origenRuta.latitud};${miUbicacion.longitud},${miUbicacion.latitud}?overview=false`;

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
        return distanciaKm;
      }
    }
  } catch {
    // Silencioso, usar fallback
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

  return distancia;
};


export const obtenerMinutosParaLlegada = (
  miUbicacion: StoppingInterface,
  ruta: RutaCompletaInterface
): number | null => {
  // Validar que tengamos coordenadas válidas
  if (!miUbicacion.latitud || !miUbicacion.longitud) {
    return null;
  }

  // Convertir StoppingInterface a UbicacionInterface para el cálculo
  const ubicacion: UbicacionInterface = {
    latitud: miUbicacion.latitud,
    longitud: miUbicacion.longitud
  };

  // 1. Calcular distancia desde mi ubicación hasta el origen de la ruta
  // RutaCompletaInterface tiene latitud/longitud directamente
  const puntoOrigen: UbicacionInterface = {
    latitud: ruta.latitud,
    longitud: ruta.longitud
  };

  const distanciaDesdeOrigen = obtenerDistanciaCarreteraFallback(ubicacion, puntoOrigen);

  // 2. Tiempo que le toma al bus llegar del origen a mi ubicación
  // (Distancia / Velocidad) * 60 para pasar a minutos
  const tiempoTransito = (distanciaDesdeOrigen / ruta.velocidad) * 60;

  // 3. Usar tiempo de espera fijo ya que RutaCompletaInterface no tiene esta propiedad
  const tiempoEspera = 5; // 5 minutos por defecto

  // 4. Calcular tiempo total hasta el próximo bus
  const tiempoTotal = tiempoTransito + tiempoEspera;

  // 5. Para simplificar, asumimos que hay un bus cada 30 minutos
  const intervaloBuses = 30;
  const minutosParaProximoBus = Math.ceil(tiempoTotal);

  // 6. Ajustar al siguiente intervalo de bus si es necesario
  const proximoBusDisponible = Math.ceil(minutosParaProximoBus / intervaloBuses) * intervaloBuses;

  return proximoBusDisponible;
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
