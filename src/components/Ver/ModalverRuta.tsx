import React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RutasInterface } from "@/Interfaces/rutas.interface";
import Image from "next/image";
import { MapPin, Clock, DollarSign, Bus } from "lucide-react";
type Props = {
  rutaSeleccionada: RutasInterface;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ModalverRuta({
  rutaSeleccionada,
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
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {rutaSeleccionada.nombre}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Detalles de la ruta
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="relative mt-6 space-y-4">
            <div className="relative mx-auto w-32 h-32 overflow-hidden rounded-2xl border-2 border-border bg-card p-1 shadow-lg">
              <div className="h-full w-full rounded-2xl bg-background p-4 flex items-center justify-center">
                {rutaSeleccionada.imagen_bus && (
                  <Image
                    src={`/img/${rutaSeleccionada.imagen_bus}.png`}
                    alt={rutaSeleccionada.nombre}
                    width={80}
                    height={80}
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/img/school-bus.png";
                    }}
                  />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-emerald-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Origen
                    </p>
                    <p className="font-semibold text-foreground">
                      {rutaSeleccionada.origen}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-200 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-fuchsia-800" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Destino
                    </p>
                    <p className="font-semibold text-foreground">
                      {rutaSeleccionada.destino}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 text-muted-foreground">
                      <span className="text-lg text-orange-800">L</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Precio
                      </p>
                      <p className="font-bold text-foreground">
                        L {rutaSeleccionada.precio}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-muted-foreground">
                      <Clock className="h-4 w-4 text-blue-800" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Velocidad
                      </p>
                      <p className="font-bold text-foreground">
                        {rutaSeleccionada.velocidad} km/h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex justify-end">
            <Button onClick={() => setOpen(false)} variant="default">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
