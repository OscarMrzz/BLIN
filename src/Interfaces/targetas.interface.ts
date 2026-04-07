export interface TargetasInterface {
  id_targetas: string;
  id_perfiles?: string;
  codigo_targeta: string;
  estado?: string;
  asignada: boolean;
}

export interface SaldoInterface {
  id_saldo: string;
  saldo_total: number;
  id_targetas?: string;
}

export interface PagosInterface {
  id_pagos: string;
  id_targeta: string;
  monto?: number;
  fecha?: Date;
  id_perfiles?: string;
  metodo?: string;
}

export interface HistorialDeRecargasInterface {
  id_historial_de_recargas: string;
  fecha?: Date;
  id_targetas?: string;
  monto?: number;
  metodo?: string;
}
