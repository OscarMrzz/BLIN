export interface puntoGeograficoInterface {
 
    latitud: number;
    longitud: number;
    nombreLugar?: string;
  
 
}

export interface rutaInterface {
  idRuta: string;
  ruta: string;
  inicioRuta: string;
  finRuta: string;
  paradasRuta: puntoGeograficoInterface[];
  precioRuta: number;
  tiempoEsperaRuta: number;
  activo: string;
  imagenBus: string;
}
