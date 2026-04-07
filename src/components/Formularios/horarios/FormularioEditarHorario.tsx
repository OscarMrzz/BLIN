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
import { updateHorario } from "@/lib/services/horariosServices";
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
  open: boolean;
  setOpen: (open: boolean) => void;
  refrescarTabla: () => void;
  horarioAEditar: HorariosInterface;
};

export function EditarHorario({
  open,
  setOpen,
  refrescarTabla,
  horarioAEditar,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Método para convertir minutos totales a formato 12h
  const convertirMinutosAFormato12h = (minutosTotales: number) => {
    const horas24 = Math.floor(minutosTotales / 60);
    const minutos = minutosTotales % 60;

    let hora12: number;
    let periodo: string;

    if (horas24 === 0) {
      hora12 = 12;
      periodo = "AM";
    } else if (horas24 < 12) {
      hora12 = horas24;
      periodo = "AM";
    } else if (horas24 === 12) {
      hora12 = 12;
      periodo = "PM";
    } else {
      hora12 = horas24 - 12;
      periodo = "PM";
    }

    return {
      hora: hora12.toString().padStart(2, "0"),
      minutos: minutos.toString().padStart(2, "0"),
      periodo,
    };
  };

  // Estado inicial desglosado con datos del horario a editar
  const getInitialFormData = (): FormData => {
    if (horarioAEditar && horarioAEditar.id_rutas) {
      const tiempoFormateado = convertirMinutosAFormato12h(
        horarioAEditar.horario,
      );
      return {
        hora: tiempoFormateado.hora,
        minutos: tiempoFormateado.minutos,
        periodo: tiempoFormateado.periodo,
        id_rutas: horarioAEditar.id_rutas,
      };
    }
    return {
      hora: "12",
      minutos: "00",
      periodo: "AM",
      id_rutas: "",
    };
  };

  const [formData, setFormData] =
    React.useState<FormData>(getInitialFormData());

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
      await updateHorario(horarioAEditar.id_horarios, {
        id_horarios: horarioAEditar.id_horarios, // Mantener el ID original
        horario: minutosTotales, // Enviamos el número calculado
        id_rutas: formData.id_rutas,
      } as HorariosInterface);
      toast.success("Horario actualizado exitosamente");

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
      toast.error("Error al guardar el horario");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster />

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>Editar Horario</DialogTitle>
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
