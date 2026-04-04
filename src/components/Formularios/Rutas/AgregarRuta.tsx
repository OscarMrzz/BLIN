"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RutasInterface } from "@/Interfaces/rutas.interface";
import { createRuta } from "@/lib/services/rutasServices";
import { PlusIcon } from "lucide-react";
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
  refrescarTabla: () => void;
};

export function AgregarRuta({ refrescarTabla }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = React.useState<RutasInterface>({
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
      await createRuta(nuevaRuta as RutasInterface);
      toast.success("Ruta creada exitosamente", {
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
      console.error("Error al guardar la ruta:", error);
      toast.error("Error al guardar la ruta", {
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
    <Dialog>
      <Toaster />
      <DialogTrigger asChild>
        <Button variant="default">
          {" "}
          <PlusIcon /> Agregar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>Agregar Ruta</DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-4">
            <Field>
              <Label htmlFor="nombre">Nombre:</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="ejemplo: El progreso - SPS"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Field>
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
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Velocidad Aproximada" />
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

            <Field>
              <Label htmlFor="origen">Origen:</Label>
              <Input
                id="origen"
                name="origen"
                placeholder="ejemplo: El progreso"
                value={formData.origen}
                onChange={handleInputChange}
                required
              />
            </Field>
            <Field>
              <Label htmlFor="destino">Destino:</Label>
              <Input
                id="destino"
                name="destino"
                placeholder="ejemplo: SPS"
                value={formData.destino}
                onChange={handleInputChange}
              />
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="ruta-activa"
                name="ruta-activa"
                defaultChecked
                checked={formData.activo === "1"}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    activo: checked ? "1" : "0",
                  }));
                }}
              />
              <FieldLabel htmlFor="ruta-activa">Ruta Activa</FieldLabel>
            </Field>
            <Select
              name="imagen_bus"
              value={formData.imagen_bus || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, imagen_bus: value }))
              }
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Modelo</SelectLabel>
                  <SelectItem value="schoolbus">School Bus</SelectItem>
                  <SelectItem value="microbus">Microbus</SelectItem>
                  <SelectItem value="castor">Castor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
