import { ParadasInterface } from "@/Interfaces/rutas.interface";
import { ClienteBrowserSupabase } from "../supabase";


export async function getAllParadas() {
    const { data, error } = await ClienteBrowserSupabase
        .from("paradas")
        .select("*");
    if (error) {
        console.error("Error al obtener las paradas:", error);
        return [];
    }

    return data as ParadasInterface[];
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
    const { data, error } = await ClienteBrowserSupabase.from("paradas").select("*").eq("id_rutas", id).single();

    if (error) {
        console.error(" [SERVICE] Error al obtener la parada:", error);
        return null;
    }

    return data;
}


export const createParada = async (parada: ParadasInterface) => {
    const { data, error } = await ClienteBrowserSupabase.from("paradas").insert(parada);
    if (error) {
        console.error("Error al crear la parada:", error);
        return null;
    }
    return data;
}

export const updateParada = async (id: string, parada: ParadasInterface) => {
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