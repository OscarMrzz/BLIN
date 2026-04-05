import React, { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StoppingInterface } from "@/Interfaces/rutas.interface";
import { MapPin, Bus } from "lucide-react";
import { getRutaById } from "@/lib/services/rutasServices";
type Props = {
  paradaSeleccionada: StoppingInterface;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ModalVerStopping({
  paradaSeleccionada,
  open,
  setOpen,
}: Props) {
  const [nombreRuta, setNombreRuta] = React.useState<string>("");

  useEffect(() => {
    if (!paradaSeleccionada.id_rutas) return;
    const ruta = getRutaById(paradaSeleccionada.id_rutas);
    ruta.then((ruta) => {
      setNombreRuta(ruta.nombre);
    });
  }, [paradaSeleccionada]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md overflow-hidden">
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <MapPin className="h-5 w-5 text-emerald-800" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {paradaSeleccionada.nombre_lugar ||
                    `Parada ${paradaSeleccionada.id_paradas}`}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">{nombreRuta}</p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-center  w-full justify-between rounded-xl bg-card border border-border p-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Latitud
                  </p>
                  <p className="font-semibold text-foreground">
                    {paradaSeleccionada.latitud}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Longitud
                  </p>
                  <p className="text-sm text-foreground">
                    {paradaSeleccionada.longitud || "N/A"}
                  </p>
                </div>
              </div>
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
