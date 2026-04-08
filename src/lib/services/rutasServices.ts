import { tablaInterface } from "@/Interfaces/tabla.interface";
import type { ColumnDef } from "@tanstack/react-table";
import { ClienteBrowserSupabase } from "../supabase";
import { ParadasDetalladasInterface, RutasInterface, StoppingInterface, VistaCompletaRutaInterface } from "@/Interfaces/rutas.interface";
import { getParadaByIdRuta } from "./ParadasServices";

export async function getAllRutas() {
  const { data, error } = await ClienteBrowserSupabase
    .from("rutas")
    .select(`
      *,
      paradas_origen:paradas!paradas_id_rutas_fkey(
        latitud,
        longitud
      )
    `);
  if (error) {
    console.error("Error al obtener las rutas:", error);
    return [];
  }

  const rutasConParadas = data?.map(ruta => ({
    ...ruta,
    punto_origen: ruta.paradas_origen?.[0] || {
      latitud: ruta.latitud_origen || 0,
      longitud: ruta.longitud_origen || 0
    },
    punto_destino: ruta.paradas_origen?.[1] || {
      latitud: ruta.latitud_destino || 0,
      longitud: ruta.longitud_destino || 0
    }
  })) || [];

  return rutasConParadas as ParadasDetalladasInterface[];
}

export async function getAllRutasForTable(): Promise<tablaInterface<RutasInterface>> {
  const { data, error } = await ClienteBrowserSupabase
    .from("rutas")
    .select(`
      *,
      paradas_origen:paradas!paradas_id_rutas_fkey(
        latitud,
        longitud
      )
    `).order("nombre", { ascending: true })
  if (error) {
    console.error("Error al obtener las rutas:", error);
    return {
      columnas: [],
      datos: []
    };
  }

  const datos = data?.map(ruta => ({
    ...ruta,
    punto_origen: ruta.paradas_origen?.[0] || {
      latitud: ruta.latitud_origen || 0,
      longitud: ruta.longitud_origen || 0
    },
    punto_destino: ruta.paradas_origen?.[1] || {
      latitud: ruta.latitud_destino || 0,
      longitud: ruta.longitud_destino || 0
    }
  })) || [];


  const columnas: ColumnDef<RutasInterface>[] = [
    {
      header: "N°",
      accessorKey: "indice",
      cell: ({ row }) => row.index + 1,
      enableSorting: false // El índice no se puede ordenar
    },
    {
      header: "Nombre",
      accessorKey: "nombre",
      enableSorting: true
    },
    {
      header: "Velocidad",
      accessorKey: "velocidad",
      enableSorting: true
    },
    {
      header: "Precio",
      accessorKey: "precio",
      enableSorting: true
    },

    {
      header: "Origen",
      accessorKey: "origen",
      enableSorting: true
    },
    {
      header: "Destino",
      accessorKey: "destino",
      enableSorting: true
    },


  ]



  return {
    columnas,
    datos
  };
}

export async function getRutaById(id: string) {
  console.log("🔍 [RUTA] Buscando ruta con ID:", id);
  console.log("🔍 [RUTA] Tipo de ID:", typeof id);

  // Obtener la ruta básica primero
  const { data: rutaData, error: rutaError } = await ClienteBrowserSupabase
    .from("rutas")
    .select("*")
    .eq("id_rutas", id)
    .single();

  console.log("📝 [RUTA] Ruta básica - data:", rutaData);
  console.log("📝 [RUTA] Ruta básica - error:", rutaError);

  if (rutaError) {
    console.error("❌ [RUTA] Error al obtener la ruta:", {
      message: rutaError.message,
      details: rutaError.details,
      hint: rutaError.hint,
      code: rutaError.code,
      id_ruta: id
    });
    return null;
  }

  // Obtener todas las paradas de la ruta usando el servicio de paradas
  const paradas = await getParadaByIdRuta(id);

  console.log("📝 [RUTA] Paradas obtenidas de ParadasService:", paradas);
  console.log("📝 [RUTA] Número de paradas:", paradas?.length || 0);

  if (!paradas || paradas.length === 0) {
    console.error("❌ [RUTA] No se encontraron paradas para la ruta:", id);
    return null;
  }

  // Ordenar paradas por distancia_desde_origen si está disponible
  const paradasOrdenadas = paradas.sort((a: StoppingInterface, b: StoppingInterface) =>
    (a.distancia_desde_origen || 0) - (b.distancia_desde_origen || 0)
  );

  console.log("📝 [RUTA] Paradas ordenadas:", paradasOrdenadas);

  // Usar la primera parada como origen y la última como destino
  const primeraParada = paradasOrdenadas[0];
  const ultimaParada = paradasOrdenadas[paradasOrdenadas.length - 1];

  console.log("📝 [RUTA] Primera parada (origen):", primeraParada);
  console.log("📝 [RUTA] Última parada (destino):", ultimaParada);

  // Transformar los datos para incluir punto_origen y punto_destino
  const rutaConCoordenadas = {
    ...rutaData,
    punto_origen: {
      latitud: primeraParada.latitud,
      longitud: primeraParada.longitud
    },
    punto_destino: {
      latitud: ultimaParada.latitud,
      longitud: ultimaParada.longitud
    },
    paradas: paradasOrdenadas
  };

  console.log("✅ [RUTA] Ruta con coordenadas procesadas:", {
    id_rutas: rutaConCoordenadas.id_rutas,
    nombre: rutaConCoordenadas.nombre,
    monto_a_cobrar: rutaConCoordenadas.monto_a_cobrar,
    precio: rutaConCoordenadas.precio,
    origen: rutaConCoordenadas.origen,
    destino: rutaConCoordenadas.destino
  });
  return rutaConCoordenadas;
}

export async function getSchemaInfo() {
  const { data, error } = await ClienteBrowserSupabase.rpc('get_schema_info', { schema_name: 'public' });
  if (error) {
    console.error("Error al obtener la información del schema:", error);
    return [];
  }
  console.log(data)
  return data;
}

export const createRuta = async (ruta: RutasInterface) => {
  const { data, error } = await ClienteBrowserSupabase.from("rutas").insert(ruta);
  if (error) {
    console.error("Error al crear la ruta:", error);
    return null;
  }
  return data;
}

export const updateRuta = async (id: string, ruta: RutasInterface) => {
  const { data, error } = await ClienteBrowserSupabase.from("rutas").update(ruta).eq("id_rutas", id);
  if (error) {
    console.error("Error al actualizar la ruta:", error);
    return null;
  }
  return data;
}

export const deleteRuta = async (id: string) => {
  const { data, error } = await ClienteBrowserSupabase.from("rutas").delete().eq("id_rutas", id);
  if (error) {
    console.error("Error al eliminar la ruta:", error);
    return null;
  }
  return data;
}

export async function vista_completa_rutas() {

  const { data, error } = await ClienteBrowserSupabase.from("vista_completa_rutas_2").select("*");
  if (error) {
    console.error("Error al obtener la vista completa de rutas:", error);
    return [];
  }

  console.log('Datos crudos de la base de datos:', data);
  console.log('Muestra del primer registro:', data?.[0]);

  return data as VistaCompletaRutaInterface[];

}
export async function vista_completa_rutas_byid(id: string) {

  const { data, error } = await ClienteBrowserSupabase.from("vista_completa_rutas_2").select("*").eq("id_rutas", id);
  if (error) {
    console.error("Error al obtener la vista completa de rutas:", error);
    return [];
  }


  return data as VistaCompletaRutaInterface[];

}


export async function getRutaImagen(idRuta: string): Promise<string> {
  try {
    const { data, error } = await ClienteBrowserSupabase.from("rutas").select("imagen_bus").eq("id_rutas", idRuta).single();
    if (error) {
      console.error("Error al obtener la imagen de la ruta:", error);
      return "";
    }
    if (!data) {
      return "";
    }
    return data.imagen_bus;
  } catch (error) {
    console.error("Error al obtener la imagen de la ruta:", error);
    return "";
  }

}
