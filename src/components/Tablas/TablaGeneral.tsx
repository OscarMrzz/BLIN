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
type Props<T> = {
  data: T[];
  columns?: ColumnDef<T>[];
  onClickAgregar?: () => void;
  BotonAgregar?: React.ElementType;
  conMasOpciones?: boolean;
  refrescarTabla: () => void;
  AbrirModalEliminar?: (id: string, nombre: string) => void;
  AbrirFormularioEditar?: (datosAEditar: T) => void;
  AbrirModalVer?: (datosAVer: T) => void;
};

export default function TablaGeneral<T>({
  data,
  columns = [],
  onClickAgregar,
  BotonAgregar,
  conMasOpciones = true,
  refrescarTabla,
  AbrirModalEliminar,
  AbrirFormularioEditar,
  AbrirModalVer,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const dispararAbrirModalEliminar = (id: string, nombre: string) => {
    AbrirModalEliminar?.(id, nombre);
  };
  const dispararAbrirFormularioEditar = (datosAEditar: T) => {
    AbrirFormularioEditar?.(datosAEditar);
  };
  const dispararAbrirModalVer = (datosAVer: T) => {
    AbrirModalVer?.(datosAVer);
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
              onEditar={() => {}}
              AbrirModalEliminar={() => {
                const rowData = row.original as Record<string, unknown>;
                dispararAbrirModalEliminar(
                  rowData.id_rutas as string,
                  row.getValue("nombre") as string,
                );
              }}
              AbrirModalVer={() => {
                const rowData = row.original as Record<string, unknown>;
                dispararAbrirModalVer(rowData as T);
              }}
              AbrirFormularioEditar={() => {
                const rowData = row.original as Record<string, unknown>;
                dispararAbrirFormularioEditar(rowData as T);
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
          {BotonAgregar && <BotonAgregar />}

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

      {/* Controles de paginación */}
      <div className="flex flex-col items-center gap-4 px-2 py-4 sm:flex-row sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {data.length} filas
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="hidden sm:inline-flex"
          >
            <span className="sr-only">Ir a la primera página</span>
            ««
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Página anterior</span>‹
          </Button>

          {/* Números de página */}
          <div className="flex items-center space-x-1">
            {Array.from(
              { length: Math.min(5, table.getPageCount()) },
              (_, i) => {
                const pageNumber = i + 1;
                const isActive =
                  table.getState().pagination.pageIndex + 1 === pageNumber;
                const totalPages = table.getPageCount();

                // Lógica para mostrar páginas alrededor de la página actual
                let showPage = false;
                const currentPage = table.getState().pagination.pageIndex + 1;

                if (totalPages <= 5) {
                  showPage = true;
                } else if (pageNumber === 1 || pageNumber === totalPages) {
                  showPage = true;
                } else if (Math.abs(pageNumber - currentPage) <= 1) {
                  showPage = true;
                }

                if (!showPage) {
                  // Mostrar ellipsis para páginas ocultas
                  if (
                    (pageNumber === 2 && currentPage > 4) ||
                    (pageNumber === totalPages - 1 &&
                      currentPage < totalPages - 3)
                  ) {
                    return (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
                          ...
                        </span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(pageNumber - 1)}
                    className="h-9 w-9 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              },
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Página siguiente</span>›
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="hidden sm:inline-flex"
          >
            <span className="sr-only">Ir a la última página</span>
            »»
          </Button>
        </div>
        <div className="text-sm text-muted-foreground sm:hidden">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para consistencia
const PaginationItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center">{children}</div>
);
