import { PerfilesInterface } from "@/Interfaces/roles.interface";
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
    tablaInterface<PerfilesInterface>
> {
    const { data, error } = await ClienteBrowserSupabase.from("perfiles")
        .select("*")
        .order("nombre", { ascending: true });

    const columnas: ColumnDef<PerfilesInterface>[] = [
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
            header: "ID Rol",
            accessorKey: "id_roles",
            enableSorting: true,
        },
        {
            header: "ID Usuario",
            accessorKey: "id_user",
            enableSorting: true,
        },
    ];

    if (error) {
        console.error("Error al obtener los perfiles:", error);
        return {
            columnas: [],
            datos: [],
        };
    }

    return {
        columnas: columnas,
        datos: data as PerfilesInterface[],
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

export const createPerfilForUser = async (userId: string, email?: string, nombre?: string, apellido?: string, id_roles?: string) => {
    try {
        const perfilData: Partial<PerfilesInterface> = {
            id_user: userId,
            nombre: nombre,
            apellido: apellido,
            id_roles: id_roles,
        };

        const { data, error } = await ClienteBrowserSupabase.from("perfiles")
            .insert(perfilData)
            .select()
            .single();

        if (error) {
            console.error("Error al crear perfil para usuario:", error);
            throw error;
        }

        console.log("Perfil creado exitosamente para usuario:", userId);
        return data;
    } catch (err) {
        console.error("Error en createPerfilForUser:", err);
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
