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

import { Badge } from "@/components/misUI/badge";
import { Button } from "@/components/misUI/button";
import { Checkbox } from "@/components/misUI/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/misUI/dropdown-menu";
import { Input } from "@/components/misUI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/misUI/table";

import { cn } from "@/lib/utils";
import MenuMasOpciones from "@/components/MenuMasOpciones/MenuMasOpciones";
type Props<T> = {
  data: T[];
  columns?: ColumnDef<T>[];

  BotonAgregar?: React.ElementType;
  conMasOpciones?: boolean;
  refrescarTabla: () => void;
  AbrirModalEliminar?: (idFila: string) => void;
  AbrirFormularioEditar?: (idFila: string) => void;
  AbrirModalVer?: (idFila: string) => void;
};

export default function TablaGeneral<T>({
  data,
  columns = [],

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

  const dispararAbrirModalEliminar = (idFila: string) => {
    AbrirModalEliminar?.(idFila);
  };
  const dispararAbrirFormularioEditar = (idFila: string) => {
    AbrirFormularioEditar?.(idFila);
  };
  const dispararAbrirModalVer = (idFila: string) => {
    AbrirModalVer?.(idFila);
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
                // Usar el ID interno de TanStack Table que es único y persistente
                dispararAbrirModalEliminar(row.id);
              }}
              AbrirModalVer={() => {
                // Usar el ID interno de TanStack Table que es único y persistente
                dispararAbrirModalVer(row.id);
              }}
              AbrirFormularioEditar={() => {
                // Usar el ID interno de TanStack Table que es único y persistente
                dispararAbrirFormularioEditar(row.id);
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
    // Generar IDs únicos para cada fila basados en el índice original
    getRowId: (row, index) => `row-${index}`,
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
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-10 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-100 shadow-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm text-gray-600 font-medium">
            {table.getSelectedRowModel().rows.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {table.getSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} filas seleccionadas
              </span>
            )}
          </div>
          {BotonAgregar && <BotonAgregar refrescarTabla={refrescarTabla} />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-200"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border-gray-200 shadow-lg"
            >
              <DropdownMenuItem
                onClick={exportToCSV}
                className="hover:bg-gray-50 focus:bg-gray-50"
              >
                <FileTextIcon className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Exportar como CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={exportToExcel}
                className="hover:bg-gray-50 focus:bg-gray-50"
              >
                <FileSpreadsheetIcon className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Exportar como Excel</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem
                onClick={exportToJSON}
                className="hover:bg-gray-50 focus:bg-gray-50"
              >
                <FileTextIcon className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-700">Exportar como JSON</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-2 border-gray-300 bg-gray-50"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      onClick={() => header.column.toggleSorting()}
                      className={cn(
                        "border-r border-gray-200 px-4 py-3 text-left font-semibold text-gray-700",
                        header.column.getCanSort() &&
                          "cursor-pointer select-none hover:bg-blue-50 transition-colors duration-200",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <div className="ml-2 flex items-center">
                            {header.column.getIsSorted() === "asc" ? (
                              <div className="flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded">
                                <ArrowUpIcon className="h-3 w-3" />
                              </div>
                            ) : header.column.getIsSorted() === "desc" ? (
                              <div className="flex items-center justify-center w-5 h-5 bg-blue-500 text-white rounded">
                                <ArrowDownIcon className="h-3 w-3" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-gray-600">
                                <ArrowUpIcon className="h-3 w-3" />
                              </div>
                            )}
                          </div>
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150",
                    index % 2 === 0 && "bg-white",
                    index % 2 === 1 && "bg-gray-50/30",
                    row.getIsSelected() && "bg-blue-50/50 border-blue-200",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-gray-700"
                    >
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
                  className="h-24 text-center text-gray-500 bg-gray-50/50"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="text-gray-400">
                      <SearchIcon className="h-8 w-8 mx-auto" />
                    </div>
                    <span className="text-sm font-medium">
                      No se encontraron resultados
                    </span>
                    <span className="text-xs text-gray-400">
                      Intenta ajustar tu búsqueda
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Controles de paginación */}
      <div className="flex flex-col items-center gap-4 px-2 py-4 sm:flex-row sm:justify-between bg-gray-50/30 rounded-lg">
        <div className="text-sm text-gray-600 font-medium bg-white px-3 py-1.5 rounded-full border border-gray-200">
          {data.length} filas totales
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="hidden sm:inline-flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="sr-only">Ir a la primera página</span>
            <span className="text-xs">««</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="sr-only">Página anterior</span>
            <span className="text-xs">‹</span>
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
                        <span className="flex h-9 w-9 items-center justify-center text-sm text-gray-400 bg-white border border-gray-200 rounded-md">
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
                    className={cn(
                      "h-9 w-9 p-0 text-sm font-medium shadow-sm transition-colors duration-200",
                      isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400",
                    )}
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
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="sr-only">Página siguiente</span>
            <span className="text-xs">›</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="hidden sm:inline-flex bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <span className="sr-only">Ir a la última página</span>
            <span className="text-xs">»»</span>
          </Button>
        </div>
        <div className="text-sm text-gray-600 font-medium bg-white px-3 py-1.5 rounded-full border border-gray-200 sm:hidden">
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
