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
import { HorariosInterface } from "@/Interfaces/rutas.interface";
import { getAllRutas } from "@/lib/services/rutasServices";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast, Toaster } from "sonner";
import { useRef } from "react";
import ComboboxGeneral from "@/components/Comobox/ComboboxGeneral";
import { createHorario } from "@/lib/services/horariosServices";
// Importa un componente Select de tu librería de UI (asumiendo que usas shadcn/ui)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/misUI/select";

type FormData = {
  hora: string;
  minutos: string;
  periodo: string;
  id_rutas: string;
};

type Props = {
  refrescarTabla: () => void;
};

export function AgregarHorario({ refrescarTabla }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Estado inicial desglosado
  const [formData, setFormData] = React.useState<FormData>({
    hora: "12",
    minutos: "00",
    periodo: "AM",
    id_rutas: "",
  });

  const { data: rutas = [] } = useQuery({
    queryKey: ["getAllRutas"],
    queryFn: getAllRutas,
  });

  const dataRutas = React.useMemo(
    () => rutas.map((ruta) => ({ value: ruta.id_rutas, label: ruta.nombre })),
    [rutas],
  );

  // Lógica de conversión a minutos totales
  const calcularMinutosTotales = () => {
    let h = parseInt(formData.hora);
    const m = parseInt(formData.minutos);
    const p = formData.periodo;

    // Ajuste para formato 12h a 24h
    if (p === "PM" && h !== 12) h += 12;
    if (p === "AM" && h === 12) h = 0;

    return h * 60 + m;
  };

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (!formData.id_rutas) {
      toast.error("Por favor seleccione una ruta", { duration: 3000 });
      return;
    }

    const minutosTotales = calcularMinutosTotales();

    try {
      const horarioData = {
        horario: minutosTotales, // Enviamos el número calculado
        id_rutas: formData.id_rutas,
      } as HorariosInterface;

      console.log("Enviando datos de horario:", horarioData);

      await createHorario(horarioData);

      toast.success("Horario creado exitosamente");

      setFormData({
        hora: "12",
        minutos: "00",
        periodo: "AM",
        id_rutas: "",
      });
      closeRef.current?.click();
      refrescarTabla();
    } catch (error) {
      console.error("Error al guardar el horario:", error);

      let errorMessage = "Error al guardar el horario";

      if (error && typeof error === "object") {
        if ("message" in error) {
          errorMessage = String(error.message);
        } else if ("details" in error) {
          errorMessage = String(error.details);
        } else {
          errorMessage = JSON.stringify(error);
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <Dialog>
      <Toaster />
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <PlusIcon className="mr-2 h-4 w-4" /> Agregar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-blue-600" />
              </div>
              Agregar Nuevo Horario
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Configure un nuevo horario para las rutas del sistema.
            </p>
          </DialogHeader>

          <FieldGroup className="space-y-6 pb-8">
            <Field className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Ruta Asociada
              </Label>
              <ComboboxGeneral
                data={dataRutas}
                placeholder="Seleccione una ruta"
                valor={formData.id_rutas}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, id_rutas: value }))
                }
              />
            </Field>

            <Field className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                Seleccione la Hora
              </Label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Select
                    value={formData.hora}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, hora: v }))
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <SelectItem
                          key={h}
                          value={h.toString().padStart(2, "0")}
                        >
                          {h.toString().padStart(2, "0")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="font-bold text-lg px-2">:</span>
                <div className="flex-1">
                  <Select
                    value={formData.minutos}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, minutos: v }))
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {["00", "15", "30", "45"].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Select
                    value={formData.periodo}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, periodo: v }))
                    }
                  >
                    <SelectTrigger className="w-full h-11 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Hora equivalente:</span>{" "}
                  {calcularMinutosTotales()} minutos del día
                </p>
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
              className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Guardar Horario
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
