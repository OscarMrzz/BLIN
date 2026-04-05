import { StoppingInterface, ParadasDetalladasInterface } from "@/Interfaces/rutas.interface";

interface UbicacionInterface {
  latitud: number;
  longitud: number;
}

interface ParadaBusInterface {
  latitud: number;
  longitud: number;
  distanciaDesdeOrigen: number;
  nombreLugar?: string;
}

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
