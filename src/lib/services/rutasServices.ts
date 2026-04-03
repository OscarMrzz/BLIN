import { tablaInterface } from "@/Interfaces/tabla.interface";
import type { ColumnDef } from "@tanstack/react-table";
import { ClienteBrowserSupabase } from "../supabase";
import { ParadasDetalladasInterface, RutasInterface } from "@/Interfaces/rutas.interface";

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
    `);
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
      header: "Tiempo de espera",
      accessorKey: "tiempo_espera",
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
  console.log(" [SERVICE] Buscando ruta con ID:", id);
  console.log(" [SERVICE] Tipo de ID:", typeof id);

  const { data, error } = await ClienteBrowserSupabase.from("rutas").select("*").eq("id_rutas", id).single();

  console.log(" [SERVICE] Respuesta Supabase - data:", data);
  console.log(" [SERVICE] Respuesta Supabase - error:", error);

  if (error) {
    console.error(" [SERVICE] Error al obtener la ruta:", error);
    return null;
  }

  console.log(" [SERVICE] Ruta encontrada:", data);
  return data;
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