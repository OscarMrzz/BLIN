"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { TargetasInterface } from "@/Interfaces/targetas.interface";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast, Toaster } from "sonner";
import { useRef } from "react";
import { updateTarjeta } from "@/lib/services/tarjetasServices";
import { Input } from "@/components/ui/input";

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
        id_perfiles: tarjetaAEditar.id_perfiles || "",
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
        id_perfiles: formData.id_perfiles,
        estado: formData.estado,
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

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>Editar Tarjeta</DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-6 pb-8">
            <Field>
              <Label>Código de Tarjeta:</Label>
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
              />
            </Field>

            <Field>
              <Label>ID del Perfil:</Label>
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
              />
            </Field>

            <Field>
              <Label>Estado:</Label>
              <select
                className="w-full p-2 border rounded-md"
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
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar</Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
