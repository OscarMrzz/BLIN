import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/misUI/dialog";
import { Button } from "@/components/misUI/button";
import { HorariosInterface } from "@/Interfaces/rutas.interface";
import { Clock, Bus } from "lucide-react";
type Props = {
  horarioSeleccionado: HorariosInterface;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ModalVerHorario({
  horarioSeleccionado,
  open,
  setOpen,
}: Props) {
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md overflow-hidden">
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Horario #{horarioSeleccionado.id_horarios}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Detalles del horario
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="relative mt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200 text-muted-foreground">
                    <Clock className="h-5 w-5 text-blue-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ID del Horario
                    </p>
                    <p className="font-semibold text-foreground">
                      #{horarioSeleccionado.id_horarios}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-muted-foreground">
                    <Clock className="h-5 w-5 text-emerald-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Horario
                    </p>
                    <p className="font-semibold text-foreground">
                      {horarioSeleccionado.horario.toString().padStart(2, "0")}
                      :00
                    </p>
                  </div>
                </div>
              </div>

              {horarioSeleccionado.id_rutas && (
                <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 text-muted-foreground">
                      <Bus className="h-5 w-5 text-purple-800" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ID de la Ruta
                      </p>
                      <p className="font-semibold text-foreground">
                        #{horarioSeleccionado.id_rutas}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="default">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
