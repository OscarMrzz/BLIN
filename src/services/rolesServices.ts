import { dataBaseSupabase } from "@/services/supabase";
import { roleInterface } from "@/Interfaces/rolesInterface";
    
export async function getRoles(){
    try {
        const { data, error } = await dataBaseSupabase.from("roles").select("*");
        return data as roleInterface[] ;
    } catch (error) {
        console.log(error);
        return null;
    }
}