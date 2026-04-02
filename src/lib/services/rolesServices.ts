import { ClienteBrowserSupabase } from "@/lib/supabase";
import { roleInterface } from "@/Interfaces/rolesInterface";

export async function getRoles() {
    try {
        const { data, error } = await ClienteBrowserSupabase.from("roles").select("*");
        return data as roleInterface[];
    } catch (error) {
        console.log(error);
        return null;
    }
}