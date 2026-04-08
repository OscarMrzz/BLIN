import React, { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/misUI/dialog";
import { Button } from "@/components/misUI/button";
import { PerfilesInterface } from "@/Interfaces/roles.interface";
import { User, Badge, CreditCard, Shield, Fingerprint } from "lucide-react";
import { getRolByUserId } from "@/lib/services/perfilesServices";

type Props = {
  perfilSeleccionado: PerfilesInterface;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ModalVerPerfil({
  perfilSeleccionado,
  open,
  setOpen,
}: Props) {
  const [nombreRol, setNombreRol] = React.useState<string>("");

  useEffect(() => {
    if (!perfilSeleccionado.id_user) return;
    const rol = getRolByUserId(perfilSeleccionado.id_user);
    rol
      .then((rol) => {
        setNombreRol(rol?.nombre || "Sin rol asignado");
      })
      .catch(() => {
        setNombreRol("Sin rol asignado");
      });
  }, [perfilSeleccionado]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg overflow-hidden border-0 shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header with gradient background - reduced height */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white flex-shrink-0">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-4 ring-white/30">
                  <User className="h-8 w-8 text-white" />
                </div>
                <DialogTitle className="text-xl font-bold">
                  {perfilSeleccionado.nombre && perfilSeleccionado.apellido
                    ? `${perfilSeleccionado.nombre} ${perfilSeleccionado.apellido}`
                    : `Perfil ${perfilSeleccionado.id_perfiles}`}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <p className="text-sm font-medium text-white/90">
                    {nombreRol}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content with improved cards - scrollable area */}
          <div className="px-6 py-4 space-y-3 flex-1 overflow-y-auto">
            {/* Personal Information Card */}
            <div className="group rounded-xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300/80">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <User className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Información Personal
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {perfilSeleccionado.nombre || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apellido
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {perfilSeleccionado.apellido || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Identification Card */}
            <div className="group rounded-xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300/80">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Identificación
                </h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DNI
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {perfilSeleccionado.dni || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* System Information Card */}
            <div className="group rounded-xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/50 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-300/80">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <CreditCard className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">
                  Información del Sistema
                </h3>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol Asignado
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {nombreRol}
                    </p>
                    {nombreRol !== "Sin rol asignado" && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with improved button */}
          <DialogFooter className="px-6 pb-6 pt-2">
            <Button
              onClick={() => setOpen(false)}
              variant="default"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-2.5 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
