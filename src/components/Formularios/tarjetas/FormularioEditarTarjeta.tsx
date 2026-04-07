"use client";
import { Button } from "@/components/misUI/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/misUI/dialog";
import { Field, FieldGroup } from "@/components/misUI/field";
import { Label } from "@/components/misUI/label";
import { TargetasInterface } from "@/Interfaces/targetas.interface";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast, Toaster } from "sonner";
import { useRef } from "react";
import { updateTarjeta } from "@/lib/services/tarjetasServices";
import { Input } from "@/components/misUI/input";

type FormData = {
  codigo_targeta: string;
  id_perfiles: string;
  estado: string;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refrescarTabla: () => void;
  tarjetaAEditar: TargetasInterface;
};

export function EditarTarjeta({
  open,
  setOpen,
  refrescarTabla,
  tarjetaAEditar,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Estado inicial con datos de la tarjeta a editar
  const getInitialFormData = (): FormData => {
    if (tarjetaAEditar) {
      return {
        codigo_targeta: tarjetaAEditar.codigo_targeta || "",
        id_perfiles: tarjetaAEditar.id_targetas || "",
        estado: tarjetaAEditar.estado || "activo",
      };
    }
    return {
      codigo_targeta: "",
      id_perfiles: "",
      estado: "activo",
    };
  };

  const [formData, setFormData] =
    React.useState<FormData>(getInitialFormData());

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (!formData.codigo_targeta.trim()) {
      toast.error("Por favor ingrese el código de la tarjeta", {
        duration: 3000,
      });
      return;
    }

    try {
      await updateTarjeta(tarjetaAEditar.id_targetas, {
        id_targetas: tarjetaAEditar.id_targetas, // Mantener el ID original
        codigo_targeta: formData.codigo_targeta.trim(),
        id_targeta: formData.id_perfiles,
        estado: formData.estado,
        asignada: tarjetaAEditar.asignada,
      } as TargetasInterface);
      toast.success("Tarjeta actualizada exitosamente");

      setFormData({
        codigo_targeta: "",
        id_perfiles: "",
        estado: "activo",
      });
      closeRef.current?.click();
      refrescarTabla();
    } catch (error) {
      console.error("Error al guardar la tarjeta:", error);
      toast.error("Error al guardar la tarjeta");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              Editar Tarjeta
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Modifique la información de la tarjeta seleccionada.
            </p>
          </DialogHeader>

          <FieldGroup className="space-y-6 pb-8">
            <Field className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Código de Tarjeta
              </Label>
              <Input
                type="text"
                placeholder="Ingrese el código de la tarjeta"
                value={formData.codigo_targeta}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    codigo_targeta: e.target.value,
                  }))
                }
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </Field>

            <Field className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                ID del Perfil
              </Label>
              <Input
                type="text"
                placeholder="Ingrese el ID del perfil (opcional)"
                value={formData.id_perfiles}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_perfiles: e.target.value,
                  }))
                }
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Campo opcional - Deje vacío si no desea asignar a un perfil
                específico
              </p>
            </Field>

            <Field className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                Estado de la Tarjeta
              </Label>
              <select
                className="w-full h-11 px-3 border border-gray-200 rounded-md focus:border-green-500 focus:ring-green-500/20 bg-white text-sm"
                value={formData.estado}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, estado: e.target.value }))
                }
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="bloqueado">Bloqueado</option>
                <option value="suspendido">Suspendido</option>
              </select>
              <div className="mt-2 flex gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Activo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-xs text-gray-600">Inactivo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Bloqueado</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Suspendido</span>
                </div>
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter className="pt-6 border-t">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-11 px-6 border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-11 px-6 bg-amber-600 hover:bg-amber-700 text-white font-medium"
            >
              Actualizar Tarjeta
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
