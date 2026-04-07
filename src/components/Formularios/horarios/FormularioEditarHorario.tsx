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
              Editar Horario
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Modifique la información del horario seleccionado.
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
                {/* Selector de Horas */}
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

                {/* Selector de Minutos */}
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

                {/* Selector AM/PM */}
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
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-700">
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
              className="h-11 px-6 bg-amber-600 hover:bg-amber-700 text-white font-medium"
            >
              Actualizar Horario
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
