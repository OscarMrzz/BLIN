import type { CellContext, HeaderContext, ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";




export interface tablaInterface<datosInterface> {
  columnas: ColumnDef<datosInterface>[];
  datos: datosInterface[];
}
