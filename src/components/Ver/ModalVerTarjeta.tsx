import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TargetasInterface } from "@/Interfaces/targetas.interface";
import { CreditCard, User, CheckCircle } from "lucide-react";
type Props = {
  tarjetaSeleccionada: TargetasInterface;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ModalVerTarjeta({
  tarjetaSeleccionada,
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
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  Tarjeta #{tarjetaSeleccionada.id_targetas}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Detalles de la tarjeta
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="relative mt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200 text-muted-foreground">
                    <CreditCard className="h-5 w-5 text-blue-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ID de la Tarjeta
                    </p>
                    <p className="font-semibold text-foreground">
                      #{tarjetaSeleccionada.id_targetas}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-muted-foreground">
                    <CreditCard className="h-5 w-5 text-emerald-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Código de Tarjeta
                    </p>
                    <p className="font-semibold text-foreground">
                      {tarjetaSeleccionada.codigo_targeta}
                    </p>
                  </div>
                </div>
              </div>

              {tarjetaSeleccionada.id_targeta && (
                <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-200 text-muted-foreground">
                      <User className="h-5 w-5 text-purple-800" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        ID del Perfil
                      </p>
                      <p className="font-semibold text-foreground">
                        #{tarjetaSeleccionada.id_targetas}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {tarjetaSeleccionada.estado && (
                <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-green-800" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Estado
                      </p>
                      <p className="font-semibold text-foreground">
                        {tarjetaSeleccionada.estado}
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
