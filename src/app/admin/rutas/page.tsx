"use client";
import TablaGeneral from "@/components/Tablas/TablaGeneral";
import { getAllRutasForTable } from "@/lib/services/rutasServices";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const {
    data: rutasList ,refetch,} = useQuery({
    queryKey: ["getAllRutasForTable"],
    queryFn: getAllRutasForTable,
  });

  const refrescarTabla = () => {
    refetch();
  };

  return (
    <div className="flex px-12">
      <TablaGeneral
        data={rutasList?.datos || []}
        columns={rutasList?.columnas || []}
        onClickAgregar={() => {}}
        refrescarTabla={refrescarTabla}
      />
    </div>
  );
}
