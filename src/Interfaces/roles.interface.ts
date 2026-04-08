export interface PerfilesConDetalles extends PerfilesInterface {
  nombre_rol?: string;
  email_usuario?: string;
  nombre_ruta?: string;
}

export interface RolesInterface {
  id_roles: string;
  nombre: string;
  estado?: string;
}

export interface PerfilesInterface {
  id_perfiles: string;
  id_roles?: string;
  nombre: string;
  apellido?: string;
  dni?: number;
  foto?: string;
  id_user?: string;
  id_rutas?: string;
}

export interface PermisosInterface {
  id_permisos: string;
  id_roles?: string;
  tabla: string;
  accion?: string;
}
