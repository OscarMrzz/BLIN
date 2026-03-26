export interface UbicacionInterface{
 
    latitud: number;
    longitud: number;

  
 
}
export interface ParadaBusInterface{
 
    latitud: number;
    longitud: number;
    distanciaDesdeOrigen: number;
    nombreLugar?: string;

  
 
}



export interface rutaInterface {
  idRuta: string;
  ruta: string;
  inicioRuta: string;
  finRuta: string;
  paradasRuta: ParadaBusInterface[];
  horariosRuta: number[];
  velocidadPromedioKmh: number;
  puntoOrigen: UbicacionInterface;
  precioRuta: number;
  tiempoEsperaRuta: number;
  activo: string;
  imagenBus: string;
}
