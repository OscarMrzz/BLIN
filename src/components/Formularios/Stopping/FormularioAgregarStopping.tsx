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
import { Input } from "@/components/misUI/input";
import { Label } from "@/components/misUI/label";
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
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          {" "}
          <PlusIcon /> Agregar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-green-600" />
              </div>
              Agregar Nueva Parada
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Complete la información para crear una nueva parada en el sistema.
            </p>
          </DialogHeader>

          <FieldGroup className="space-y-6 pb-8">
            <Field className="space-y-2">
              <Label
                htmlFor="id_rutas"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Ruta Asociada
              </Label>
              <ComboboxGeneral
                data={dataRutas}
                placeholder="Seleccione una ruta"
                valor={formData.id_rutas}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, id_rutas: value }))
                }
              />
            </Field>

            <Field className="space-y-2">
              <Label
                htmlFor="nombre_lugar"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                Nombre del Lugar
              </Label>
              <Input
                id="nombre_lugar"
                name="nombre_lugar"
                placeholder="ejemplo: Parque Central"
                value={formData.nombre_lugar}
                onChange={handleInputChange}
                className="h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                required
              />
            </Field>

            <Field className="space-y-2">
              <Label
                htmlFor="cordenadas"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                Coordenadas GPS
              </Label>
              <Input
                id="cordenadas"
                name="cordenadas"
                type="text"
                placeholder="ejemplo: 15.551024502999981, -88.01233620944075"
                value={formData.cordenadas}
                onChange={handleInputChange}
                className="h-11 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ingrese las coordenadas en formato: latitud, longitud
              </p>
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
              className="h-11 px-6 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Guardar Parada
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
