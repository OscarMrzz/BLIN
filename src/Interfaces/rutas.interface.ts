export interface RutasInterface {
  id_rutas: string;
  nombre: string;
  velocidad: number;
  precio: number;
  tiempo_espera?: number;
  origen: string;
  destino: string;
  activo: string;
  imagen_bus?: string;
}

export interface BusesInterface {
  id_buses: string;
  id_rutas?: string;
  placa: string;
  estado?: string;
}

export interface ParadasInterface {
  id_paradas: string;
  latitud: number;
  longitud?: number;
  distancia_desde_origen?: number;
  id_rutas?: string;
  nombre_lugar?: string;
}
export interface ParadasDetalladasInterface {
    id_rutas: string;
  nombre: string;
  velocidad: number;
  precio: number;
  tiempo_espera?: number;
  origen: string;
  destino: string;
  activo: string;
  imagen_bus?: string;
  punto_origen: {
    latitud: number;
    longitud: number;
  };
  punto_destino: {
    latitud: number;
    longitud: number;
  };
 
}

export interface ViajesInterface {
  id_viajes: string;
  id_buses: string;
  id_choferes?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  estado?: string;
}

export interface ChoferesInterface {
  id_choferes: string;
  id_usuarios: string;
  licencia?: string;
  estado?: string;
}

export interface HorariosInterface {
  id_horarios: string;
  horario: number;
  id_rutas?: string;
}

export interface GpsInterface {
  id_gps: string;
  fecha?: Date;
  id_buses?: string;
}
