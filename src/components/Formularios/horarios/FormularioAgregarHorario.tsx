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
} from "@/components/ui/select";

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
        <Button variant="default">
          <PlusIcon className="mr-2 h-4 w-4" /> Agregar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>Agregar Horario</DialogTitle>
          </DialogHeader>

          <FieldGroup className="space-y-6 pb-8">
            <Field>
              <Label>Ruta:</Label>
              <ComboboxGeneral
                data={dataRutas}
                placeholder="Seleccione una ruta"
                valor={formData.id_rutas}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, id_rutas: value }))
                }
              />
            </Field>

            <Field>
              <Label>Seleccione la Hora:</Label>
              <div className="flex gap-2 items-center">
                {/* Selector de Horas */}
                <Select
                  value={formData.hora}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, hora: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="HH" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <SelectItem key={h} value={h.toString().padStart(2, "0")}>
                        {h.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="font-bold">:</span>

                {/* Selector de Minutos */}
                <Select
                  value={formData.minutos}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, minutos: v }))
                  }
                >
                  <SelectTrigger className="w-full">
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

                {/* Selector AM/PM */}
                <Select
                  value={formData.periodo}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, periodo: v }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Equivale a: <strong>{calcularMinutosTotales()} minutos</strong>{" "}
                del día.
              </p>
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
