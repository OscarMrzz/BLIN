import React from "react";
import { DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  MapPinIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export interface MenuMasOpcionesProps<T> {
  row: {
    original: T;
  };
  onVer?: (item: T) => void;
  onAgregarHorarios?: (item: T) => void;
  onAgregarCordenadas?: (item: T) => void;
  onDescargar?: (item: T) => void;
  onEditar?: (item: T) => void;
  onEliminar?: (item: T) => void;
  accionesPersonalizadas?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    className?: string;
  }>;
}

export default function MenuMasOpciones<T>({
  row,
  onAgregarHorarios,
  onAgregarCordenadas,
  onVer,
  onDescargar,
  onEditar,
  onEliminar,
  accionesPersonalizadas = [],
}: MenuMasOpcionesProps<T>) {
  const item = row.original;

  // Verificar si hay alguna acción disponible
  const tieneAcciones = !!(
    onVer ||
    onDescargar ||
    onEditar ||
    onEliminar ||
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
          {onVer && (
            <DropdownMenuItem onClick={() => onVer(item)}>
              <EyeIcon className="mr-2 size-4" />
              Ver
            </DropdownMenuItem>
          )}
          {onAgregarHorarios && (
            <DropdownMenuItem onClick={() => onAgregarHorarios(item)}>
              <ClockIcon className="mr-2 size-4" />
              Agregar Horarios
            </DropdownMenuItem>
          )}
          {onAgregarCordenadas && (
            <DropdownMenuItem onClick={() => onAgregarCordenadas(item)}>
              <MapPinIcon className="mr-2 size-4" />
              Agregar Cordenadas
            </DropdownMenuItem>
          )}
          {onDescargar && (
            <DropdownMenuItem onClick={() => onDescargar(item)}>
              <DownloadIcon className="mr-2 size-4" />
              Descargar
            </DropdownMenuItem>
          )}
          {onEditar && (
            <DropdownMenuItem onClick={() => onEditar(item)}>
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
          {onEliminar && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onEliminar(item)}
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
