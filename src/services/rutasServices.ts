
import { dataBaseSupabase } from "./supabase";
import { ParadasDetalladasInterface } from "@/Interfaces/rutas.interface";
dataBaseSupabase




export async function getAllRutas() {

  const { data, error } = await dataBaseSupabase
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
  return data ;
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