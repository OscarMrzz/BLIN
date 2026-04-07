"use client";
import { Button } from "@/components/misUI/button";
import { Checkbox } from "@/components/misUI/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/misUI/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/misUI/field";
import { Input } from "@/components/misUI/input";
import { Label } from "@/components/misUI/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/misUI/select";
import { RutasInterface } from "@/Interfaces/rutas.interface";
import { createRuta, updateRuta } from "@/lib/services/rutasServices";
import React from "react";
import { toast, Toaster } from "sonner";
import { useRef } from "react";

/* 
  id_rutas: string;
  nombre: string;
  velocidad: number;
  precio: number;
  tiempo_espera?: number;
  origen: string;
  destino: string;
  activo: string;
  imagen_bus?: string;

*/

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  refrescarTabla: () => void;
  rutaAEditar: RutasInterface;
};

export function FormularioEditarRuta({
  open,
  setOpen,
  refrescarTabla,
  rutaAEditar,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = React.useState<RutasInterface>(rutaAEditar);
  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (
      !formData.nombre ||
      !formData.origen ||
      !formData.destino ||
      formData.velocidad <= 0 ||
      !formData.imagen_bus
    ) {
      toast.error("Por favor complete todos los campos", {
        duration: 3000,
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    const nuevaRuta: Omit<RutasInterface, "id_rutas"> = {
      nombre: formData.nombre,
      velocidad: formData.velocidad,
      precio: formData.precio,
      tiempo_espera: formData.tiempo_espera,
      origen: formData.origen,
      destino: formData.destino,
      activo: formData.activo,
      imagen_bus: formData.imagen_bus,
    };

    try {
      await updateRuta(rutaAEditar.id_rutas, nuevaRuta as RutasInterface);
      toast.success("Ruta editada exitosamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
      // Resetear formulario y cerrar diálogo
      setFormData({
        id_rutas: "",
        nombre: "",
        velocidad: 0,
        precio: 0,
        tiempo_espera: 0,
        origen: "",
        destino: "",
        activo: "1",
        imagen_bus: "",
      });
      closeRef.current?.click();
      refrescarTabla();
    } catch (error) {
      console.error("Error al editar la ruta:", error);
      toast.error("Error al editar la ruta", {
        duration: 3000,
        style: {
          background: "red",
          color: "white",
        },
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              Editar Ruta
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Modifique la información de la ruta seleccionada.
            </p>
          </DialogHeader>

          <FieldGroup className="space-y-6">
            <Field className="space-y-2">
              <Label
                htmlFor="nombre"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Nombre de la Ruta
              </Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="ejemplo: El progreso - SPS"
                value={formData.nombre}
                onChange={handleInputChange}
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                required
              />
            </Field>
            <Field className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                Velocidad Aproximada
              </Label>
              <Select
                name="velocidad"
                value={formData.velocidad.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    velocidad: parseInt(value),
                  }))
                }
              >
                <SelectTrigger className="w-full h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                  <SelectValue placeholder="Seleccione velocidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Velocidad Aproximada</SelectLabel>
                    <SelectItem value="80">80 km/h</SelectItem>
                    <SelectItem value="100">100 km/h</SelectItem>
                    <SelectItem value="120">120 km/h</SelectItem>
                    <SelectItem value="140">140 km/h</SelectItem>
                    <SelectItem value="160">160 km/h</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field className="space-y-2">
              <Label
                htmlFor="origen"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                Origen
              </Label>
              <Input
                id="origen"
                name="origen"
                placeholder="ejemplo: El progreso"
                value={formData.origen}
                onChange={handleInputChange}
                className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                required
              />
            </Field>
            <Field className="space-y-2">
              <Label
                htmlFor="destino"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                Destino
              </Label>
              <Input
                id="destino"
                name="destino"
                placeholder="ejemplo: SPS"
                value={formData.destino}
                onChange={handleInputChange}
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
            </Field>
            <Field className="space-y-2">
              <Label
                htmlFor="precio"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-yellow-500 rounded-full"></span>
                Precio
              </Label>
              <Input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                min="0"
                placeholder="ejemplo: 100.00"
                value={formData.precio}
                onChange={handleInputChange}
                className="h-11 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20"
              />
            </Field>

            <Field className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Checkbox
                  id="ruta-activa"
                  name="ruta-activa"
                  checked={formData.activo === "1"}
                  onCheckedChange={(checked) => {
                    setFormData((prev) => ({
                      ...prev,
                      activo: checked ? "1" : "0",
                    }));
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <FieldLabel
                  htmlFor="ruta-activa"
                  className="text-sm font-medium cursor-pointer"
                >
                  Marcar como ruta activa
                </FieldLabel>
              </div>
            </Field>
            <Field className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                Modelo de Autobús
              </Label>
              <Select
                name="imagen_bus"
                value={formData.imagen_bus || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, imagen_bus: value }))
                }
              >
                <SelectTrigger className="w-full h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20">
                  <SelectValue placeholder="Seleccione modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Modelo</SelectLabel>
                    <SelectItem value="school-bus">School Bus</SelectItem>
                    <SelectItem value="microbus">Microbus</SelectItem>
                    <SelectItem value="castor">Castor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              Actualizar Ruta
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
