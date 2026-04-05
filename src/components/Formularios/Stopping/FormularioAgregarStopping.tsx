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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StoppingInterface } from "@/Interfaces/rutas.interface";
import { createParada } from "@/lib/services/ParadasServices";
import { getAllRutas } from "@/lib/services/rutasServices";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast, Toaster } from "sonner";
import { useRef } from "react";
import ComboboxGeneral from "@/components/Comobox/ComboboxGeneral";

type Props = {
  refrescarTabla: () => void;
};

export function AgregarStopping({ refrescarTabla }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = React.useState({
    nombre_lugar: "",
    cordenadas: "",
    id_rutas: "",
  });

  // Obtener todas las rutas usando TanStack Query
  const { data: rutas = [] } = useQuery({
    queryKey: ["getAllRutas"],
    queryFn: getAllRutas,
  });

  const dataRutas = React.useMemo(
    () => rutas.map((ruta) => ({ value: ruta.id_rutas, label: ruta.nombre })),
    [rutas],
  );

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (!formData.nombre_lugar || !formData.cordenadas || !formData.id_rutas) {
      toast.error("Por favor complete todos los campos requeridos", {
        duration: 3000,
        style: {
          background: "red",
          color: "white",
        },
      });
      return;
    }

    try {
      const [latitud, longitud] = formData.cordenadas.split(", ");
      await createParada({
        nombre_lugar: formData.nombre_lugar,
        id_rutas: formData.id_rutas,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
      } as StoppingInterface);
      toast.success("Parada creada exitosamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
      // Resetear formulario y cerrar diálogo
      setFormData({
        nombre_lugar: "",
        cordenadas: "",
        id_rutas: "",
      });
      closeRef.current?.click();
      refrescarTabla();
    } catch (error) {
      console.error("Error al guardar la parada:", error);
      toast.error("Error al guardar la parada", {
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
            <DialogTitle>Agregar Parada</DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-4 pb-8">
            <Field>
              <Label htmlFor="id_rutas">Ruta:</Label>

              <ComboboxGeneral
                data={dataRutas}
                placeholder="Seleccione una ruta"
                valor={formData.id_rutas}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, id_rutas: value }))
                }
              />
            </Field>

            <Field>
              <Label htmlFor="nombre_lugar">Nombre del Lugar:</Label>
              <Input
                id="nombre_lugar"
                name="nombre_lugar"
                placeholder="ejemplo: Parque Central"
                value={formData.nombre_lugar}
                onChange={handleInputChange}
                required
              />
            </Field>

            <Field>
              <Label htmlFor="cordenadas">Cordenadas:</Label>
              <Input
                id="cordenadas"
                name="cordenadas"
                type="text"
                placeholder="ejemplo: 15.551024502999981, -88.01233620944075"
                value={formData.cordenadas}
                onChange={handleInputChange}
                required
              />
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
