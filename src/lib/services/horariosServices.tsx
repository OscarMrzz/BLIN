import { HorariosInterface } from "@/Interfaces/rutas.interface";
import { ClienteBrowserSupabase } from "../supabase";
import { ColumnDef } from "@tanstack/react-table";
import { tablaInterface } from "@/Interfaces/tabla.interface";
import { Row } from "@tanstack/react-table";

export async function getAllHorarios() {
  const { data, error } =
    await ClienteBrowserSupabase.from("horarios").select("*");
  if (error) {
    console.error("Error al obtener los horarios:", error);
    return [];
  }

  return data as HorariosInterface[];
}
export async function getAllHorariosForTable(): Promise<
  tablaInterface<HorariosInterface>
> {
  const { data, error } = await ClienteBrowserSupabase.from("horarios")
    .select("*")
    .order("horario", { ascending: true });
  const columnas: ColumnDef<HorariosInterface>[] = [
    {
      header: "N°",
      accessorKey: "indice",
      cell: ({ row }) => row.index + 1,
      enableSorting: false, // El índice no se puede ordenar
    },

    {
      header: "Horario",
      accessorKey: "horario",
      cell: ({ row }: { row: Row<HorariosInterface> }) => {
        const minutosTotales = row.getValue("horario") as number;
        const horas = Math.floor(minutosTotales / 60);
        const minutos = minutosTotales % 60;
        const periodo = horas >= 12 ? "pm" : "am";
        const hora12 = horas > 12 ? horas - 12 : horas === 0 ? 12 : horas;
        return `${hora12.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")} ${periodo}`;
      },
      enableSorting: true,
    },
    {
      header: "ID Ruta",
      accessorKey: "id_rutas",
      enableSorting: true,
    },
  ];

  if (error) {
    console.error("Error al obtener los horarios:", error);
    return {
      columnas: [],
      datos: [],
    };
  }

  return {
    columnas: columnas,
    datos: data as HorariosInterface[],
  };
}

export async function getHorarioById(id: string) {
  const { data, error } = await ClienteBrowserSupabase.from("horarios")
    .select("*")
    .eq("id_horarios", id)
    .single();

  if (error) {
    console.error(" [SERVICE] Error al obtener el horario:", error);
    return null;
  }

  return data;
}
export async function getHorariosByIdRuta(id: string) {
  const { data, error } = await ClienteBrowserSupabase.from("horarios")
    .select("*")
    .eq("id_rutas", id);

  if (error) {
    console.error(
      " [SERVICE] Error al obtener los horarios de la ruta:",
      error,
    );
    return [];
  }

  return data as HorariosInterface[];
}

export const createHorario = async (horario: HorariosInterface) => {
  try {
    const { data, error } =
      await ClienteBrowserSupabase.from("horarios").insert(horario);
    if (error) {
      console.error("Error de Supabase:", error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Error en createHorario:", err);
    throw err;
  }
};

export const updateHorario = async (id: string, horario: HorariosInterface) => {
  try {
    const { data, error } = await ClienteBrowserSupabase.from("horarios")
      .update(horario)
      .eq("id_horarios", id);
    if (error) {
      console.error("Error de Supabase:", error);
      throw error;
    }
    return data;
  } catch (err) {
    console.error("Error en updateHorario:", err);
    throw err;
  }
};

export const deleteHorario = async (id: string) => {
  try {
    console.log("Intentando eliminar horario con ID:", id);

    // Verificar que el ID no sea nulo o vacío
    if (!id || id.trim() === "") {
      throw new Error("El ID del horario es requerido y no puede estar vacío");
    }

    const { data, error } = await ClienteBrowserSupabase.from("horarios")
      .delete()
      .eq("id_horarios", id);

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

    console.log("Horario eliminado exitosamente:", data);
    return data;
  } catch (err) {
    console.error("Error en deleteHorario:", err);

    // Proporcionar un mensaje más descriptivo
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Error desconocido al eliminar el horario");
    }
  }
};
