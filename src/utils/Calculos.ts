import { ParadaBusInterface, rutaInterface, UbicacionInterface } from "@/Interfaces/rutas.iterface";

export const obtenerDistanciaCarretera = async (
  miUbicacion: UbicacionInterface,
  origenRuta: UbicacionInterface
): Promise<number> => {
  try {
    // OSRM usa el formato: longitud,latitud;longitud,latitud
    const url = `https://router.project-osrm.org/route/v1/driving/${origenRuta.longitud},${origenRuta.latitud};${miUbicacion.longitud},${miUbicacion.latitud}?overview=false`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (datos.code !== 'Ok') {
      throw new Error("No se pudo calcular la ruta por carretera");
    }

    // La distancia viene en metros, la convertimos a kilómetros
    const distanciaKm = datos.routes[0].distance / 1000;
    return distanciaKm;
  } catch (error) {
    console.error("Error en el cálculo de ruta:", error);
    return 0;
  }
};


export const obtenerMinutosParaLlegada = (
  miParada: ParadaBusInterface,
  ruta: rutaInterface
): number | null => {
  const ahora = new Date();
  const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();

  // 1. Tiempo que le toma al bus llegar de la terminal a MI parada
  // (Distancia / Velocidad) * 60 para pasar a minutos
  const tiempoTransito = (miParada.distanciaDesdeOrigen / ruta.velocidad) * 60;

  // 2. Buscar la salida cuyo (despacho + viaje) sea mayor a la hora actual
  if (!ruta.horarios_ruta || ruta.horarios_ruta.length === 0) {
    console.log("❌ La ruta no tiene horarios definidos");
    return null;
  }

  const proximaSalida = ruta.horarios_ruta.find(salida => (salida + tiempoTransito) > minutosActuales);

  if (!proximaSalida) {
    console.log("❌Ya no hay mas buses en tu posicion")
    return null
  }; // Ya no pasan buses hoy

  // 3. Resultado: Hora de llegada estimada - hora actual
  return Math.round((proximaSalida + tiempoTransito) - minutosActuales);
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