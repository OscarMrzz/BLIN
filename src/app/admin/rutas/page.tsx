"use client";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { getAllRutasForTable } from "@/lib/services/rutasServices";
import { useEffect, useState } from "react";
import { RutasInterface } from "@/Interfaces/rutas.interface";
import { ColumnDef } from "@tanstack/react-table";

export default function Page() {
  const [data, setData] = useState<RutasInterface[]>([]);
  const [columns, setColumns] = useState<
    ColumnDef<RutasInterface>[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const respuesta = await getAllRutasForTable();
      setData(respuesta.datos);
      setColumns(respuesta.columnas);
    };
    fetchData();
  }, []);
  return (
    <div className="flex px-12">
      <TablaGeneral data={data} columns={columns} />
    </div>
  );
}
