import { ClienteBrowserSupabase } from "@/lib/supabase";
import { roleInterface } from "@/Interfaces/rolesInterface";

export async function getRoles() {
    try {
        const { data, error } = await ClienteBrowserSupabase.from("roles").select("*");
        if (error) {
            console.error("Error al obtener roles:", error);
            return null;
        }
        return data as roleInterface[];
    } catch (error) {
        console.error("Error en getRoles:", error);
        return null;
    }
}
