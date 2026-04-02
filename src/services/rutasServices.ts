import { rutaInterface } from "@/Interfaces/rutas.iterface";
import { dataBaseSupabase } from "./supabase";
dataBaseSupabase
const rutasList: rutaInterface[] = [
  {
    id_rutas: "1",
    nombre: "EL Progreso - SPS 1",
    origen: "Progreso",
    destino: "SPS",
    parada_ruta: [
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
    horarios_ruta: [60 * 6, 60 * 7, 60 * 8, 60 * 9, 60 * 10, 60 * 11, 60 * 12],
    velocidad: 60,
    punto_origen: {
      latitud: 15.402234196302475,
      longitud: -87.80691885330488,
    },
    punto_destino: {
      latitud: 15.507397295352558,
      longitud: -88.02121220066151,
    },
    precio: 0,
    tiempo_espera: 60 * 45,
    activo: "1",
    imagen_bus: "/ruta1.png",
  },
  {
    id_rutas: "2",
    nombre: "Mezapa - El progreso",
    origen: "Mezapa",
    destino: "El progreso",
    parada_ruta: [
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
    horarios_ruta: [60 * 6, 60 * 7, 60 * 8, 60 * 9, 60 * 10, 60 * 11, 60 * 12, 60 * 13, 60 * 14, 60 * 15, 60 * 16, 60 * 17, 20 * 60, 21 * 60, 22 * 60, 23 * 60, 24 * 60],
    velocidad: 60,
    punto_origen: {
      latitud: 15.603563320676374,
      longitud: -87.66929792025022,
    },
    punto_destino: {
      latitud: 15.402027212485665,
      longitud: -87.8065947301114,
    },
    precio: 0,
    tiempo_espera: 60 * 30,
    activo: "1",
    imagen_bus: "",
  },
  {
    id_rutas: "3",
    nombre: "Tela - El progreso",
    origen: "Tela",
    destino: "El progreso",
    parada_ruta: [
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
    horarios_ruta: [60 * 6, 60 * 7, 60 * 8, 60 * 9, 60 * 10, 60 * 11, 60 * 12],
    velocidad: 60,
    punto_origen: {
      latitud: 15.784339660097425,
      longitud: -87.44925482232273,
    },
    punto_destino: {
      latitud: 15.40149026303692,
      longitud: -87.81089969399692,
    },
    precio: 0,
    tiempo_espera: 60 * 20,
    activo: "1",
    imagen_bus: "",
  },
  {
    id_rutas: "4",
    nombre: "Tela Expres",
    origen: "Tela",
    destino: "SPS",
    parada_ruta: [
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
    horarios_ruta: [60 * 6, 60 * 7, 60 * 8, 60 * 9, 60 * 10, 60 * 11, 60 * 12],
    velocidad: 60,
    punto_origen: {
      latitud: 15.784339660097425,
      longitud: -87.44925482232273,
    },
    punto_destino: {
      latitud: 15.505888005310675,
      longitud: -88.02133628991511,
    },
    precio: 0,
    tiempo_espera: 60 * 20,
    activo: "1",
    imagen_bus: "",
  },
];



export async function getAllRutas() {


  const { data, error } = await dataBaseSupabase.from("rutas").select("*");
  if (error) {
    console.error("Error al obtener las rutas:", error);
    return [];
  }
  console.log(data)
  return data as rutaInterface[];
}

export async function getRutaById(id: string) {
  console.log(" [SERVICE] Buscando ruta con ID:", id);
  console.log(" [SERVICE] Tipo de ID:", typeof id);

  const { data, error } = await dataBaseSupabase.from("rutas").select("*").eq("id_rutas", id).single();

  console.log(" [SERVICE] Respuesta Supabase - data:", data);
  console.log(" [SERVICE] Respuesta Supabase - error:", error);

  if (error) {
    console.error(" [SERVICE] Error al obtener la ruta:", error);
    return null;
  }

  console.log(" [SERVICE] Ruta encontrada:", data);
  return data as rutaInterface;
}

export async function getSchemaInfo() {
  const { data, error } = await dataBaseSupabase.rpc('get_schema_info', { schema_name: 'public' });
  if (error) {
    console.error("Error al obtener la información del schema:", error);
    return [];
  }
  console.log(data)
  return data;
}