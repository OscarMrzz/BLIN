import { StoppingInterface } from "@/Interfaces/rutas.interface";
import { ClienteBrowserSupabase } from "../supabase";
import { ColumnDef } from "@tanstack/react-table";
import { tablaInterface } from "@/Interfaces/tabla.interface";


export async function getAllParadas() {
    const { data, error } = await ClienteBrowserSupabase
        .from("paradas")
        .select("*");
    if (error) {
        console.error("Error al obtener las paradas:", error);
        return [];
    }

    /* 
      id_paradas: string;
  latitud: number;
  longitud?: number;
  distancia_desde_origen?: number;
  id_rutas?: string;
  nombre_lugar?: string;
    
    */



    return data as StoppingInterface[];
}
export async function getAllParadasForTable(): Promise<tablaInterface<StoppingInterface>> {
    const { data, error } = await ClienteBrowserSupabase
        .from("paradas")
        .select("*")
        .order("nombre_lugar", { ascending: true });
    const columnas: ColumnDef<StoppingInterface>[] = [
        {
            header: "N°",
            accessorKey: "indice",
            cell: ({ row }) => row.index + 1,
            enableSorting: false // El índice no se puede ordenar
        },
        {
            header: "lugar",
            accessorKey: "nombre_lugar",
            enableSorting: true
        },
        {
            header: "latitud",
            accessorKey: "latitud",
            enableSorting: true
        },
        {
            header: "longitud",
            accessorKey: "longitud",
            enableSorting: true
        },


    ];



    if (error) {
        console.error("Error al obtener las paradas:", error);
        return {
            columnas: [],
            datos: []
        };
    }

    return {
        columnas: columnas,
        datos: data as StoppingInterface[]
    };
}



export async function getParadaByIdParada(id: string) {
    const { data, error } = await ClienteBrowserSupabase.from("paradas").select("*").eq("id_paradas", id).single();

    if (error) {
        console.error(" [SERVICE] Error al obtener la parada:", error);
        return null;
    }

    return data;
}
export async function getParadaByIdRuta(id: string) {
    console.log("🔍 [PARADAS SERVICE] Buscando paradas para ruta ID:", id);

    const { data, error } = await ClienteBrowserSupabase.from("paradas").select("*").eq("id_rutas", id);

    console.log("📦 [PARADAS SERVICE] Respuesta Supabase - data:", data);
    console.log("❌ [PARADAS SERVICE] Respuesta Supabase - error:", error);
    console.log("📊 [PARADAS SERVICE] Número de paradas encontradas:", data?.length || 0);

    // Verificar todas las paradas que existen en la base de datos
    const { data: todasParadas, error: errorTodas } = await ClienteBrowserSupabase.from("paradas").select("id_paradas, id_rutas, nombre_lugar").limit(10);
    console.log("🌍 [PARADAS SERVICE] Primeras 10 paradas en la BD:", todasParadas);
    console.log("📈 [PARADAS SERVICE] Total de paradas en BD:", todasParadas?.length || 0);

    if (error) {
        console.error(" [SERVICE] Error al obtener la parada:", error);
        return null;
    }

    return data;
}


export const createParada = async (parada: StoppingInterface) => {
    const { data, error } = await ClienteBrowserSupabase.from("paradas").insert(parada);
    if (error) {
        console.error("Error al crear la parada:", error);
        return null;
    }
    return data;
}

export const updateParada = async (id: string, parada: StoppingInterface) => {
    const { data, error } = await ClienteBrowserSupabase.from("paradas").update(parada).eq("id_paradas", id);
    if (error) {
        console.error("Error al actualizar la parada:", error);
        return null;
    }
    return data;
}

export const deleteParada = async (id: string) => {
    const { data, error } = await ClienteBrowserSupabase.from("paradas").delete().eq("id_paradas", id);
    if (error) {
        console.error("Error al eliminar la parada:", error);
        return null;
    }
    return data;
}
