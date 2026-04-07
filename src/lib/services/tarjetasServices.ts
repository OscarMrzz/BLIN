import { TargetasInterface } from "@/Interfaces/targetas.interface";
import { ClienteBrowserSupabase } from "../supabase";
import { ColumnDef } from "@tanstack/react-table";
import { tablaInterface } from "@/Interfaces/tabla.interface";
import { createItemSaldo } from "./saldoServices";

export async function getAllTarjetas() {
    const { data, error } =
        await ClienteBrowserSupabase.from("targetas").select("*");
    if (error) {
        console.error("Error al obtener las tarjetas:", error);
        return [];
    }

    return data as TargetasInterface[];
}
export async function getAllTarjetasForTable(): Promise<
    tablaInterface<TargetasInterface>
> {
    const { data, error } = await ClienteBrowserSupabase.from("targetas")
        .select("*")
        .order("codigo_targeta", { ascending: true });
    const columnas: ColumnDef<TargetasInterface>[] = [
        {
            header: "N°",
            accessorKey: "indice",
            cell: ({ row }) => row.index + 1,
            enableSorting: false,
        },
        {
            header: "Código Tarjeta",
            accessorKey: "codigo_targeta",
            enableSorting: true,
        },
        {
            header: "ID Perfil",
            accessorKey: "id_perfiles",
            enableSorting: true,
        },
        {
            header: "Estado",
            accessorKey: "estado",
            enableSorting: true,
        },
    ];

    if (error) {
        console.error("Error al obtener las tarjetas:", error);
        return {
            columnas: [],
            datos: [],
        };
    }

    return {
        columnas: columnas,
        datos: data as TargetasInterface[],
    };
}

export async function getTarjetaById(id: string) {
    const { data, error } = await ClienteBrowserSupabase.from("targetas")
        .select("*")
        .eq("id_targetas", id)
        .single();

    if (error) {
        console.error(" [SERVICE] Error al obtener la tarjeta:", error);
        return null;
    }

    return data;
}
export async function getTarjetasByIdPerfil(id: string) {
    const { data, error } = await ClienteBrowserSupabase.from("targetas")
        .select("*")
        .eq("id_perfiles", id);

    if (error) {
        console.error(
            " [SERVICE] Error al obtener las tarjetas del perfil:",
            error,
        );
        return [];
    }

    return data as TargetasInterface[];
}

export const createTarjeta = async (tarjeta: TargetasInterface) => {
    try {
        const { data, error } =
            await ClienteBrowserSupabase.from("targetas")
                .insert(tarjeta)
                .select();
        if (error) {
            console.error("Error de Supabase:", error);
            throw error;
        }
        try {
            if (data && data.length > 0 && data[0].id_targetas) {
                await createItemSaldo(data[0].id_targetas);
            } else {
                console.warn("No se pudo obtener el ID de la tarjeta creada para inicializar el saldo");
            }
        } catch (error) {
            console.error("Error al crear el saldo:", error);
        }
        return data;
    } catch (err) {
        console.error("Error en createTarjeta:", err);
        throw err;
    }
};

export const updateTarjeta = async (id: string, tarjeta: TargetasInterface) => {
    try {
        const { data, error } = await ClienteBrowserSupabase.from("targetas")
            .update(tarjeta)
            .eq("id_targetas", id);
        if (error) {
            console.error("Error de Supabase:", error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error("Error en updateTarjeta:", err);
        throw err;
    }
};

export const deleteTarjeta = async (id: string) => {
    try {
        console.log("Intentando eliminar tarjeta con ID:", id);

        // Verificar que el ID no sea nulo o vacío
        if (!id || id.trim() === "") {
            throw new Error("El ID de la tarjeta es requerido y no puede estar vacío");
        }

        const { data, error } = await ClienteBrowserSupabase.from("targetas")
            .delete()
            .eq("id_targetas", id);

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

        console.log("Tarjeta eliminada exitosamente:", data);
        return data;
    } catch (err) {
        console.error("Error en deleteTarjeta:", err);

        // Proporcionar un mensaje más descriptivo
        if (err instanceof Error) {
            throw err;
        } else {
            throw new Error("Error desconocido al eliminar la tarjeta");
        }
    }
};

export const generateUniqueCardCodes = async (cantidad: number): Promise<string[]> => {
    try {
        if (cantidad <= 0 || cantidad > 100) {
            throw new Error("La cantidad debe estar entre 1 y 100");
        }

        const codigosGenerados: string[] = [];

        // Obtener todos los códigos existentes para evitar duplicados
        const { data: tarjetasExistentes, error: errorExistente } = await ClienteBrowserSupabase
            .from("targetas")
            .select("codigo_targeta");

        if (errorExistente) {
            console.error("Error al obtener tarjetas existentes:", errorExistente);
            throw new Error("No se pudo verificar códigos existentes");
        }

        const codigosExistentes = new Set(tarjetasExistentes?.map(t => t.codigo_targeta) || []);

        // Generar códigos con formato XXXYYYYZZZ
        let prefix = 100; // 100-999
        let suffix = 100; // 100-999
        const year = 2026;

        while (codigosGenerados.length < cantidad && prefix <= 999) {
            while (suffix <= 999 && codigosGenerados.length < cantidad) {
                const codigo = `${prefix}${year}${suffix}`;

                if (!codigosExistentes.has(codigo)) {
                    codigosGenerados.push(codigo);
                }

                suffix++;
            }

            if (codigosGenerados.length < cantidad) {
                prefix++;
                suffix = 100; // Reiniciar suffix para el siguiente prefix
            }
        }

        if (codigosGenerados.length < cantidad) {
            throw new Error(`No se pudieron generar ${cantidad} códigos únicos. Solo se generaron ${codigosGenerados.length}`);
        }

        return codigosGenerados;
    } catch (err) {
        console.error("Error en generateUniqueCardCodes:", err);
        throw err;
    }
};

export const createMultipleTarjetas = async (cantidad: number, id_targeta?: string): Promise<{ exitosas: TargetasInterface[], errores: string[] }> => {
    try {
        if (cantidad <= 0 || cantidad > 100) {
            throw new Error("La cantidad debe estar entre 1 y 100");
        }

        // Generar códigos únicos
        const codigos = await generateUniqueCardCodes(cantidad);

        // Preparar datos para inserción masiva
        const tarjetasParaInsertar = codigos.map(codigo => ({
            codigo_targeta: codigo,
            id_perfiles: id_targeta || null,
            asignada: id_targeta ? true : false,
            estado: "activo"
        }));

        // Insertar todas las tarjetas en una sola operación
        const { data, error } = await ClienteBrowserSupabase
            .from("targetas")
            .insert(tarjetasParaInsertar)
            .select();

        if (error) {
            console.error("Error en inserción masiva:", error);
            throw new Error(`Error al crear tarjetas: ${error.message}`);
        }

        const exitosas = data as TargetasInterface[];
        const errores: string[] = [];

        // Verificar que se crearon todas las tarjetas
        if (exitosas.length !== cantidad) {
            errores.push(`Se esperaban ${cantidad} tarjetas pero solo se crearon ${exitosas.length}`);
        }

        // Crear saldos para las tarjetas creadas exitosamente
        try {
            for (const tarjeta of exitosas) {
                if (tarjeta.id_targetas) {
                    await createItemSaldo(tarjeta.id_targetas);
                } else {
                    errores.push(`Tarjeta creada sin ID: ${tarjeta.codigo_targeta}`);
                }
            }
        } catch (error) {
            console.error("Error al crear saldos para tarjetas múltiples:", error);
            errores.push("Error al crear algunos saldos");
        }

        return { exitosas, errores };
    } catch (err) {
        console.error("Error en createMultipleTarjetas:", err);
        throw err;
    }
};


export async function asignarQR(id_targeta: string) {

    try {
        const { data, error } = await ClienteBrowserSupabase.from("targetas")
            .update({ asignada: true })
            .eq("id_targetas", id_targeta);
        if (error) {
            console.error("Error de Supabase:", error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error("Error en updateTarjeta:", err);
        throw err;
    }
};


export async function getTarjetasNoAsignadas() {
    try {
        const { data, error } = await ClienteBrowserSupabase.from("targetas")
            .select("*")
            .eq("asignada", false);
        if (error) {
            console.error("Error de Supabase:", error);
            throw error;
        }
        return data;
    } catch (err) {
        console.error("Error en gettarjetasNoAsignadas:", err);
        throw err;
    }
}