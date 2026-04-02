import { ClienteBrowserSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";



export async function login(email: string, password: string) {
    const { data, error } = await ClienteBrowserSupabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}
export async function register(email: string, password: string) {
    const { data, error } = await ClienteBrowserSupabase.auth.signUp({
        email,
        password
    });
    return { data, error };
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




