
import { rutaInterface } from "@/Interfaces/rutas.iterface";

const rutasList: rutaInterface[] = [
  {
    idRuta: "1",
    ruta: "EL Progreso - SPS 1",
    inicioRuta: "Progreso",
    finRuta: "SPS",
    paradasRuta: [
      /* 15.402234196302475, -87.80691885330488 */
      {
        latitud: 15.402234196302475,
        longitud: -87.80691885330488,
        distanciaDesdeOrigen: 0,
        nombreLugar: "Progreso",
      },
      {
        /* 15.507397295352558, -88.02121220066151 */
        latitud: 15.507397295352558,
        longitud: -88.02121220066151,
        distanciaDesdeOrigen: 0,
        nombreLugar: "SPS",
      },
    
   
    ],
    horariosRuta: [60*6,60*7,60*8,60*9,60*10,60*11,60*12],
    velocidadPromedioKmh: 60,
    precioRuta: 0,
    puntoOrigen: {
      latitud: 15.402234196302475,
      longitud: -87.80691885330488,
    },
    tiempoEsperaRuta: 60 * 45,
    activo: "1",
    imagenBus: "/ruta1.png",
  },
  {
    idRuta: "2",
    ruta: "Mezapa - El progreso",
    inicioRuta: "Mezapa",
    finRuta: "El progreso",
    paradasRuta: [
      /* 15.603563320676374, -87.66929792025022 */
      {
        latitud: 15.603563320676374,
        longitud: -87.66929792025022,
        distanciaDesdeOrigen: 0,
        nombreLugar: "Mezapa",
      },
      {
        /* 15.402027212485665, -87.8065947301114 */
        latitud: 15.402027212485665,
        longitud: -87.8065947301114,
        distanciaDesdeOrigen: 0,
        nombreLugar: "El progreso",
      },
    ],
    horariosRuta: [60*6,60*7,60*8,60*9,60*10,60*11,60*12,60*13,60*14,60*15,60*16,60*17,20*60],
    velocidadPromedioKmh: 60,
    precioRuta: 0,
    puntoOrigen: {
      latitud: 15.603563320676374,
      longitud: -87.66929792025022,
    },
    tiempoEsperaRuta: 60 * 30,
    activo: "1",
    imagenBus: "",
  },
  {
    idRuta: "3",
    ruta: "Tela - El progreso",
    inicioRuta: "Tela",
    finRuta: "El progreso",
    paradasRuta: [
      {
        /* 15.784339660097425, -87.44925482232273 */
        latitud: 15.784339660097425,
        longitud: -87.44925482232273,
        distanciaDesdeOrigen: 0,
        nombreLugar: "Tela",
      },
      {
        /* 15.40149026303692, -87.81089969399692 */
        latitud: 15.40149026303692,
        longitud: -87.81089969399692,
        distanciaDesdeOrigen: 0,
        nombreLugar: "El progreso",
      },
    ],
    horariosRuta: [60*6,60*7,60*8,60*9,60*10,60*11,60*12],
    velocidadPromedioKmh: 60,
    precioRuta: 0,
    puntoOrigen: {
      latitud: 15.784339660097425,
      longitud: -87.44925482232273,
    },
    tiempoEsperaRuta: 60 * 20,
    activo: "1",
    imagenBus: "",
  },
  {
    idRuta: "4",
    ruta: "Tela Expres",
    inicioRuta: "Tela",
    finRuta: "SPS",
    paradasRuta: [
      {
        /* 15.784339660097425, -87.44925482232273 */
        latitud: 15.784339660097425,
        longitud: -87.44925482232273,
        distanciaDesdeOrigen: 0,
        nombreLugar: "Tela",
      },
      {
        /* 15.505888005310675, -88.02133628991511*/
        latitud: 15.505888005310675,
        longitud: -88.02133628991511,
        distanciaDesdeOrigen: 0,
        nombreLugar: "SPS",
      },

    ],
    horariosRuta: [60*6,60*7,60*8,60*9,60*10,60*11,60*12],
    velocidadPromedioKmh: 60,
    precioRuta: 0,
    puntoOrigen: {
      latitud: 15.784339660097425,
      longitud: -87.44925482232273,
    },
    tiempoEsperaRuta: 60 * 20,
    activo: "1",
    imagenBus: "",
  },
];



export function getAllRutas() {
  return rutasList;
}

export function getRutaById(id: string) {
  return rutasList.find((ruta) => ruta.idRuta === id) as rutaInterface;
}