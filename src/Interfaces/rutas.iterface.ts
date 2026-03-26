export interface UbicacionInterface {

  latitud: number;
  longitud: number;



}
export interface ParadaBusInterface {

  latitud: number;
  longitud: number;
  distanciaDesdeOrigen: number;
  nombreLugar?: string;



}



export interface rutaInterface {
  id_rutas: string;
  nombre: string;
  origen: string;
  destino: string;
  parada_ruta: ParadaBusInterface[] ;
  horarios_ruta: number[] ;
  velocidad: number;
  punto_origen: UbicacionInterface;
  precio: number;
  tiempo_espera: number;
  activo: string;
  imagen_bus?: string;
}

