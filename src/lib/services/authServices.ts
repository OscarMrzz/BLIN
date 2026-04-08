import { ClienteBrowserSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";



export async function login(email: string, password: string) {
    console.log("🔄 Iniciando login:", { email });

    const { data, error } = await ClienteBrowserSupabase.auth.signInWithPassword({
        email,
        password
    });

    console.log("📝 Respuesta de Supabase signInWithPassword:", { data, error });

    if (error) {
        console.error("❌ Error en login:", {
            message: error.message,
            status: error.status,
            code: error.code || 'NO_CODE',
            details: error
        });
        return { data, error };
    }


    return { data, error };
}
export async function register(email: string, password: string, nombre?: string, apellido?: string) {
    console.log("🔄 Iniciando registro de usuario:", { email, nombre, apellido });

    try {
        // Create user in auth with metadata
        const { data, error } = await ClienteBrowserSupabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre: nombre || '',
                    apellido: apellido || ''
                }
            }
        });

        console.log("📝 Respuesta de Supabase auth.signUp:", { data, error });

        if (error) {
            console.error("❌ Error en registro de auth:", {
                message: error.message,
                status: error.status,
                code: error.code || 'NO_CODE',
                details: error
            });
            return { data, error };
        }


        console.log("✅ Registro completado exitosamente");
        return { data, error };
    } catch (error) {
        console.error(" Error inesperado en register:", error);
        return { data: null, error };
    }
}

export const getUserAuth = async () => {
    console.log(" [AUTH] Obteniendo usuario autenticado");

    const { data, error } = await ClienteBrowserSupabase.auth.getUser();

    if (error) {
        console.error(" [AUTH] Error al obtener usuario:", {
            message: error.message,
            status: error.status,
            code: error.code || 'NO_CODE'
        });
        return null;
    }

    console.log(" [AUTH] Usuario obtenido:", data?.user ? {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
    } : null);
    return data.user as User | null;
};

export async function logout() {
    console.log(" Cerrando sesión");

    const { error } = await ClienteBrowserSupabase.auth.signOut();

    if (error) {
        console.error("❌ Error al cerrar sesión:", error);
    } else {
        console.log("✅ Sesión cerrada exitosamente");
    }

    return { error };
}

export async function isSession() {
    console.log("🔄 Verificando sesión activa");

    const { data, error } = await ClienteBrowserSupabase.auth.getSession();

    if (error) {
        console.error("❌ Error al verificar sesión:", error);
    } else {
        console.log("📝 Estado de sesión:", data.session ? "Activa" : "Inactiva");
    }

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
    console.log("🔄 Obteniendo perfil de usuario");

    const { data, error } = await ClienteBrowserSupabase.auth.getUser();

    if (error) {
        console.error("❌ Error al obtener perfil:", error);
    } else {
        console.log("📝 Perfil obtenido:", data?.user ? { id: data.user.id, email: data.user.email } : null);
    }

    return { data, error };
}




