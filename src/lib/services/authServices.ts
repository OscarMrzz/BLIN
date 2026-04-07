import { ClienteBrowserSupabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { createPerfilForUser, getPerfilByIdUser } from "./perfilesServices";



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

    // Si el login es exitoso, verificar si tiene perfil y crearlo si no tiene
    if (data.user) {
        console.log("✅ Login exitoso, verificando perfil del usuario:", data.user.id);
        try {
            const perfilExistente = await getPerfilByIdUser(data.user.id);

            if (!perfilExistente) {
                console.log("👤 Usuario no tiene perfil, creando perfil automáticamente");
                // Extraer nombre y apellido del metadata del usuario si existe
                const nombre = data.user.user_metadata?.nombre || data.user.user_metadata?.full_name?.split(' ')[0] || '';
                const apellido = data.user.user_metadata?.apellido || data.user.user_metadata?.full_name?.split(' ')[1] || '';

                await createPerfilForUser(data.user.id, nombre, apellido);
                console.log("✅ Perfil creado automáticamente para usuario:", data.user.id);
            } else {
                console.log("📝 Usuario ya tiene perfil");
            }
        } catch (profileError) {
            console.error("❌ Error al verificar/crear perfil:", profileError);
            // No fallar el login, solo registrar el error
        }
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
        console.error("❌ Error inesperado en register:", error);
        return { data: null, error };
    }
}

export const getUserAuth = async () => {
    console.log("🔄 Obteniendo usuario autenticado");

    const { data, error } = await ClienteBrowserSupabase.auth.getUser();

    if (error) {
        console.error("❌ Error al obtener usuario:", error);
        return null;
    }

    console.log("📝 Usuario obtenido:", data?.user ? { id: data.user.id, email: data.user.email } : null);
    return data.user as User | null;
}

export async function logout() {
    console.log("🔄 Cerrando sesión");

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




