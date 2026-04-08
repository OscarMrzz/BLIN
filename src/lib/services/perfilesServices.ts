import { PerfilesInterface, PerfilesConDetalles } from "@/Interfaces/roles.interface";
import { ClienteBrowserSupabase } from "../supabase";
import { ColumnDef } from "@tanstack/react-table";
import { tablaInterface } from "@/Interfaces/tabla.interface";

export async function getAllPerfiles() {
    const { data, error } =
        await ClienteBrowserSupabase.from("perfiles").select("*");
    if (error) {
        console.error("Error al obtener los perfiles:", error);
        return [];
    }

    return data as PerfilesInterface[];
}

export async function getAllPerfilesForTable(): Promise<
    tablaInterface<PerfilesConDetalles>
> {
    // First get all perfiles
    const { data: perfilesData, error: perfilesError } = await ClienteBrowserSupabase.from("perfiles")
        .select("*")
        .order("nombre", { ascending: true });

    if (perfilesError) {
        console.error("Error al obtener los perfiles:", perfilesError);
        return {
            columnas: [],
            datos: [],
        };
    }

    // Get roles data separately
    const { data: rolesData, error: rolesError } = await ClienteBrowserSupabase.from("roles")
        .select("id_roles, nombre");

    if (rolesError) {
        console.error("Error al obtener los roles:", rolesError);
        // Continue even if roles fail
    }

    // Get rutas data separately
    const { data: rutasData, error: rutasError } = await ClienteBrowserSupabase.from("rutas")
        .select("id_rutas, nombre, origen, destino");

    if (rutasError) {
        console.error("Error al obtener las rutas:", rutasError);
        // Continue even if rutas fail
    }

    const columnas: ColumnDef<PerfilesConDetalles>[] = [
        {
            header: "N°",
            accessorKey: "indice",
            cell: ({ row }) => row.index + 1,
            enableSorting: false,
        },
        {
            header: "Nombre",
            accessorKey: "nombre",
            enableSorting: true,
        },
        {
            header: "Apellido",
            accessorKey: "apellido",
            enableSorting: true,
        },
        {
            header: "DNI",
            accessorKey: "dni",
            enableSorting: true,
        },
        {
            header: "Rol",
            accessorKey: "nombre_rol",
            enableSorting: true,
        },
        {
            header: "Ruta",
            accessorKey: "nombre_ruta",
            enableSorting: true,
        },

    ];

    // Transform data to include role name, route name and user email
    const transformedData = perfilesData?.map((perfil: PerfilesInterface) => {
        const rol = rolesData?.find(r => r.id_roles === perfil.id_roles);
        const ruta = rutasData?.find(r => r.id_rutas === perfil.id_rutas);

        return {
            ...perfil,
            nombre_rol: rol?.nombre || 'Sin rol',
            nombre_ruta: ruta ? `${ruta.nombre} (${ruta.origen} - ${ruta.destino})` : 'Sin ruta',
            email_usuario: 'Sin email' // Por ahora mostramos Sin email hasta que sepamos la tabla correcta
        } as PerfilesConDetalles;
    }) || [];

    return {
        columnas: columnas,
        datos: transformedData,
    };
}

export async function getPerfilById(id: string) {
    const { data, error } = await ClienteBrowserSupabase.from("perfiles")
        .select("*")
        .eq("id_perfiles", id)
        .single();

    if (error) {
        console.error(" [SERVICE] Error al obtener el perfil:", error);
        return null;
    }

    return data;
}

export async function getPerfilByIdUser(id: string) {
    const { data, error } = await ClienteBrowserSupabase.from("perfiles")
        .select("*")
        .eq("id_user", id)
        .single();

    if (error) {
        console.error(" [SERVICE] Error al obtener el perfil por usuario:", error);
        return null;
    }

    return data;
}

export async function getRolByUserId(id: string) {
    try {
        const perfil = await getPerfilByIdUser(id);
        if (!perfil || !perfil.id_roles) {
            return null;
        }

        const { data, error } = await ClienteBrowserSupabase.from("roles")
            .select("*")
            .eq("id_roles", perfil.id_roles)
            .single();

        if (error) {
            console.error(" [SERVICE] Error al obtener el rol:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error(" [SERVICE] Error en getRolByUserId:", error);
        return null;
    }
}

export const createPerfil = async (perfil: PerfilesInterface) => {
    try {
        const { data, error } =
            await ClienteBrowserSupabase.from("perfiles").insert(perfil);
        if (error) {
            console.error("Error de Supabase:", error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error("Error en createPerfil:", err);
        throw err;
    }
};

export const updatePerfil = async (id: string, perfil: PerfilesInterface) => {
    try {
        const { data, error } = await ClienteBrowserSupabase.from("perfiles")
            .update(perfil)
            .eq("id_perfiles", id);
        if (error) {
            console.error("Error de Supabase:", error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error("Error en updatePerfil:", err);
        throw err;
    }
};

export const deletePerfil = async (id: string) => {
    try {
        console.log("Intentando eliminar perfil con ID:", id);

        if (!id || id.trim() === "") {
            throw new Error("El ID del perfil es requerido y no puede estar vacío");
        }

        const { data, error } = await ClienteBrowserSupabase.from("perfiles")
            .delete()
            .eq("id_perfiles", id);

        if (error) {
            console.error("Error de Supabase:", error);
            console.error("Detalles del error:", {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code,
            });
            throw new Error(
                `Error de Supabase: ${error.message || "Error desconocido"}`,
            );
        }

        console.log("Perfil eliminado exitosamente:", data);
        return data;
    } catch (err) {
        console.error("Error en deletePerfil:", err);

        if (err instanceof Error) {
            throw err;
        } else {
            throw new Error("Error desconocido al eliminar el perfil");
        }
    }
};

export const createPerfilForUser = async (userId: string, nombre?: string, apellido?: string, id_roles?: string, id_rutas?: string) => {
    console.log("Creando perfil para usuario:", { userId, nombre, apellido, id_roles, id_rutas });

    try {
        const perfilData: Partial<PerfilesInterface> = {
            id_user: userId,
            nombre: nombre,
            apellido: apellido,
            id_roles: id_roles,
            id_rutas: id_rutas,
        };

        console.log("📝 Datos del perfil a insertar:", perfilData);

        const { data, error } = await ClienteBrowserSupabase.from("perfiles")
            .insert(perfilData)
            .select()
            .single();

        if (error) {
            console.error("❌ Error al crear perfil para usuario:", {
                message: error.message,
                code: error.code || 'NO_CODE',
                details: error.details,
                hint: error.hint
            });
            throw error;
        }

        console.log("✅ Perfil creado exitosamente para usuario:", userId);
        return data;
    } catch (err) {
        console.error("❌ Error en createPerfilForUser:", err);
        throw err;
    }
};


export interface userConEmail {
    id_perfil: string;
    email: string;
}

export const getAllPerfilesWithUserEmail = async () => {
    try {
        const { data, error } = await ClienteBrowserSupabase
            .from('perfiles')
            .select(`
                id_perfil,
                users:auth!inner(email)
            `);

        if (error) {
            console.error("Error al obtener perfiles con emails:", error);
            return [];
        }

        // Transform data to match userConEmail interface
        const transformedData = data?.map((item: { id_perfil: string; users: { email: string }[] }) => ({
            id_perfil: item.id_perfil,
            email: item.users?.[0]?.email || ''
        })).filter(item => item.email) || [];

        return transformedData as userConEmail[];
    } catch (err) {
        console.error("Error en getAllPerfilesWithUserEmail:", err);
        return [];
    }
};
