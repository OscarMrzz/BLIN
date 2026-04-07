import React from "react";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export interface MenuMasOpcionesProps<T> {
  row: {
    original: T;
  };
  onVer?: (item: T) => void;

  onDescargar?: (item: T) => void;
  onEditar?: () => void;
  AbrirModalEliminar?: () => void;
  AbrirModalVer?: () => void;
  AbrirFormularioEditar?: () => void;
  accionesPersonalizadas?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    className?: string;
  }>;
}

export default function MenuMasOpciones<T>({
  row,

  onVer,
  onDescargar,
  onEditar,
  AbrirModalEliminar,
  AbrirModalVer,
  AbrirFormularioEditar,
  accionesPersonalizadas = [],
}: MenuMasOpcionesProps<T>) {
  const item = row.original;

  // Verificar si hay alguna acción disponible
  const tieneAcciones = !!(
    onVer ||
    onDescargar ||
    onEditar ||
    AbrirModalEliminar ||
    AbrirModalVer ||
    AbrirFormularioEditar ||
    accionesPersonalizadas.length > 0
  );

  if (!tieneAcciones) {
    return null; // No renderizar nada si no hay acciones
  }

  return (
    <div className="text-right ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 cursor-pointer">
            <MoreVerticalIcon className="size-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {AbrirModalVer && (
            <DropdownMenuItem onClick={() => AbrirModalVer()}>
              <EyeIcon className="mr-2 size-4" />
              Ver
            </DropdownMenuItem>
          )}

          {onDescargar && (
            <DropdownMenuItem onClick={() => onDescargar(item)}>
              <DownloadIcon className="mr-2 size-4" />
              Descargar
            </DropdownMenuItem>
          )}
          {AbrirFormularioEditar && (
            <DropdownMenuItem onClick={() => AbrirFormularioEditar()}>
              <PencilIcon className="mr-2 size-4" />
              Editar
            </DropdownMenuItem>
          )}

          {accionesPersonalizadas.map((accion, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => accion.onClick(item)}
              className={accion.className}
            >
              {accion.icon && (
                <span className="mr-2 size-4">{accion.icon}</span>
              )}
              {accion.label}
            </DropdownMenuItem>
          ))}
          {AbrirModalEliminar && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => AbrirModalEliminar()}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon className="mr-2 size-4" />
                Eliminar
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
