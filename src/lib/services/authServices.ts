import { ClienteBrowserSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { createPerfilForUser } from "./perfilesServices";



export async function login(email: string, password: string) {
    const { data, error } = await ClienteBrowserSupabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}
export async function register(email: string, password: string, nombre?: string, apellido?: string) {
    try {
        // Create user in auth
        const { data, error } = await ClienteBrowserSupabase.auth.signUp({
            email,
            password
        });

        if (error) {
            console.error("Error en registro de auth:", error);
            return { data, error };
        }

        // If user created successfully, create profile
        if (data.user && (nombre || apellido)) {
            try {
                await createPerfilForUser(data.user.id, nombre || '', apellido);
                console.log("Perfil creado automáticamente para usuario:", data.user.id);
            } catch (profileError) {
                console.error("Error al crear perfil automáticamente:", profileError);
                // Don't fail the registration, just log the error
            }
        }

        return { data, error };
    } catch (error) {
        console.error("Error en register:", error);
        return { data: null, error };
    }
}

export const getUserAuth = async () => {
    const { data, error } = await ClienteBrowserSupabase.auth.getUser();

    try {
        if (!data) return null
        return data.user as User | null;
    } catch (error) {
        return null;
    }
}

export async function logout() {
    const { error } = await ClienteBrowserSupabase.auth.signOut();
    return { error };
}

export async function isSession() {
    const { data, error } = await ClienteBrowserSupabase.auth.getSession();
    return { data, error };
}

export async function cerrarSesion() {
    const { error } = await logout();
    if (!error) {
        window.location.href = '/';
    }
    return { error };
}

export async function getUserProfile() {
    const { data, error } = await ClienteBrowserSupabase.auth.getUser();
    return { data, error };
}




