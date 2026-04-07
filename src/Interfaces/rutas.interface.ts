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

export interface StoppingInterface {
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



export interface RutaCompletaInterface {
  id_horarios: string;     // UUID: "f3297904-6a93-4ce1-b9bf-ae00c28d37d5"
  id_paradas: string;      // UUID: "dfc21814-c179-40d3-a86d-91c472e6eee4"
  id_rutas: string;        // UUID: "1dc486ad-8c1b-44e0-b623-0cdf7aea31b5"
  nombre: string;          // "Azacualpa - San Pedro Sula"
  origen: string;          // "Azacualpa"
  destino: string;         // "San Pedro Sula"
  horario: number;         // 840 (Probablemente minutos del día o formato militar)
  latitud: number;         // 15.4713
  longitud: number;        // -88.033705
  velocidad: number;       // 80
  activo: string | boolean; // Viene como "1", puedes tiparlo como string o convertirlo
}
