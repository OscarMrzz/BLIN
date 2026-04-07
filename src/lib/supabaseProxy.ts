import { PerfilesInterface } from "@/Interfaces/roles.interface";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  return { supabase, response };
}

const getByIdUSer = async (idUser: string, request: NextRequest) => {
  try {
    const { supabase } = await updateSession(request);

    const { data, error } = await supabase.from("perfiles").select("*").eq("id_user", idUser).single();

    if (error) throw error;
    return data as PerfilesInterface;
  } catch (error) {
    throw error;
  }
};

export const perfilTienePermiso = async (idUser: string, request: NextRequest) => {
  try {
    const perfil = await getByIdUSer(idUser, request);
    const perfilTienePermiso = true;
    if (!perfil) return false;
    return perfilTienePermiso;
  } catch (error) {
    console.log("Error al intentar verificar si el usuario tiene permido");
    throw error;
  }
};

const getRol = async (perfil: PerfilesInterface, request: NextRequest) => {
  try {
    console.log("Buscando rol para perfil:", perfil.id_perfiles, "con id_roles:", perfil.id_roles);

    if (!perfil.id_roles) {
      console.log("El perfil no tiene id_roles asignado");
      return null;
    }

    const { supabase } = await updateSession(request);
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("id_roles", perfil.id_roles)
      .single();

    if (error) {
      console.log("Error en consulta de rol:", error);
      return null;
    }

    console.log("Rol encontrado:", data);
    return data;
  } catch (error) {
    console.log("Error al obtener el rol:", error);
    return null;
  }
};

const tienePermisolRol = async (perfil: PerfilesInterface, request: NextRequest) => {
  const { supabase } = await updateSession(request);
  const { data, error } = await supabase
    .from("roles")
    .select("*")
    .eq("id_roles", perfil.id_roles)
    .single();

  if (error) throw error;

  if (!data) return false;

  return data.estado;
};

export const rolData = async (idUser: string, request: NextRequest) => {
  const perfil = await getByIdUSer(idUser, request);
  const dataRoll = await getRol(perfil, request);
  const rol = dataRoll?.nombre || 'sin_rol';
  const rolTienePrmiso = await tienePermisolRol(perfil, request);

  return { rol, rolTienePrmiso };
};
