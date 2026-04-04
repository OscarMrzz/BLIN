"use client";

import { useState } from "react";

import {
  DownloadIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";

import Papa from "papaparse";
import * as XLSX from "xlsx";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import MenuMasOpciones from "@/components/MenuMasOpciones/MenuMasOpciones";
import { AgregarRuta } from "../Formularios/Rutas/AgregarRuta";

type Props<T> = {
  data: T[];
  columns?: ColumnDef<T>[];
  onClickAgregar?: () => void;
  conMasOpciones?: boolean;
  refrescarTabla: () => void;
  onEliminar?: (id: string, nombre: string) => void;
};

export default function TablaGeneral<T>({
  data,
  columns = [],
  onClickAgregar,
  conMasOpciones = true,
  refrescarTabla,
  onEliminar,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const dispararAbrirModalEliminar = (id: string, nombre: string) => {
    onEliminar?.(id, nombre);
  };
  // Agregar automáticamente la columna de acciones si conMasOpciones es true
  const columnasconMasOpciones = conMasOpciones
    ? [
        ...columns,
        {
          header: () => <div className="text-right"></div>,
          accessorKey: "acciones",
          cell: ({ row }) => (
            <MenuMasOpciones
              row={row}
              onVer={() => {}}
              onEditar={() => {}}
              onEliminar={() => {
                const rowData = row.original as Record<string, unknown>;
                dispararAbrirModalEliminar(
                  rowData.id_rutas as string,
                  row.getValue("nombre") as string,
                );
              }}
            />
          ),
        } as ColumnDef<T>,
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: columnasconMasOpciones,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const exportToCSV = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const csv = Papa.unparse(dataToExport, {
      header: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payments-export-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

    // Opción 1: Ancho automático basado en el contenido
    const cols: { wch: number }[] = [];
    if (dataToExport.length > 0) {
      const firstRow = dataToExport[0] as Record<string, unknown>;
      Object.keys(firstRow).forEach((key) => {
        // Calcular el máximo largo del contenido en esta columna
        const maxLength = Math.max(
          key.length, // largo del encabezado
          ...dataToExport.map(
            (row) => String((row as Record<string, unknown>)[key] || "").length,
          ),
        );
        cols.push({ wch: Math.min(Math.max(maxLength + 2, 10), 50) }); // mínimo 10, máximo 50
      });
    }

    worksheet["!cols"] = cols;

    XLSX.writeFile(
      workbook,
      `payments-export-${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  const exportToJSON = () => {
    const selectedRows = table.getSelectedRowModel().rows;

    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original);

    const json = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `payments-export-${new Date().toISOString().split("T")[0]}.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between gap-2 pb-4 max-sm:flex-col sm:items-center">
        <div className="relative max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
          <Input
            placeholder="buscar..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-muted-foreground text-sm">
            {table.getSelectedRowModel().rows.length > 0 && (
              <span className="mr-2">
                {table.getSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </span>
            )}
          </div>
          {onClickAgregar && <AgregarRuta refrescarTabla={refrescarTabla} />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <DownloadIcon className="mr-2" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportToCSV}>
                <FileTextIcon className="mr-2 size-4" />
                Exportar como CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToExcel}>
                <FileSpreadsheetIcon className="mr-2 size-4" />
                Exportar como Excel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportToJSON}>
                <FileTextIcon className="mr-2 size-4" />
                Exportar como JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={() => header.column.toggleSorting()}
                      className={cn(
                        "cursor-pointer select-none",
                        header.column.getCanSort() && "hover:bg-muted/50",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUpIcon className="ml-2 h-4 w-4" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ) : (
                          <div className="ml-2 h-4 w-4"></div>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnasconMasOpciones.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground mt-4 text-center text-sm">
        Data table with export functionality (CSV, Excel, JSON)
      </p>
    </div>
  );
}
