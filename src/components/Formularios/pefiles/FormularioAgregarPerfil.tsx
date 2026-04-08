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
import { Field } from "@/components/misUI/field";
import { Input } from "@/components/misUI/input";
import { Label } from "@/components/misUI/label";
import { PerfilesInterface } from "@/Interfaces/roles.interface";
import { createPerfil } from "@/lib/services/perfilesServices";
import { getRoles } from "@/lib/services/rolesServices";
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

export function AgregarPerfil({ refrescarTabla }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = React.useState({
    nombre: "",
    apellido: "",
    dni: "",
    id_roles: "",
    id_user: "",
    id_rutas: "",
  });

  // Obtener todos los roles usando TanStack Query
  const { data: roles = null } = useQuery({
    queryKey: ["getAllRoles"],
    queryFn: getRoles,
  });

  // Obtener todas las rutas usando TanStack Query
  const { data: rutas = null } = useQuery({
    queryKey: ["getAllRutas"],
    queryFn: getAllRutas,
  });

  const dataRoles = React.useMemo(
    () =>
      roles
        ? roles
            .filter((rol) => rol && rol.id_roles !== undefined && rol.nombre)
            .map((rol) => ({
              value: rol.id_roles.toString(),
              label: rol.nombre,
            }))
        : [],
    [roles],
  );

  const dataRutas = React.useMemo(
    () =>
      rutas
        ? rutas
            .filter((ruta) => ruta && ruta.id_rutas && ruta.nombre)
            .map((ruta) => ({
              value: ruta.id_rutas.toString(),
              label: ruta.nombre,
            }))
        : [],
    [rutas],
  );

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.dni ||
      !formData.id_roles
    ) {
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
      await createPerfil({
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni: parseInt(formData.dni),
        id_roles: formData.id_roles,
        id_user: formData.id_user || undefined,
        id_rutas: formData.id_rutas || undefined,
      } as PerfilesInterface);
      toast.success("Perfil creado exitosamente", {
        duration: 3000,
        style: {
          background: "green",
          color: "white",
        },
      });
      // Resetear formulario y cerrar diálogo
      setFormData({
        nombre: "",
        apellido: "",
        dni: "",
        id_roles: "",
        id_user: "",
        id_rutas: "",
      });
      closeRef.current?.click();
      refrescarTabla();
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      toast.error("Error al guardar el perfil", {
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

      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="mb-4 flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-green-600" />
              </div>
              Agregar Nuevo Perfil
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Complete la información para crear un nuevo perfil en el sistema.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pb-4 max-h-[60vh]">
            <Field className="space-y-2">
              <Label
                htmlFor="id_roles"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Rol Asociado
              </Label>
              <ComboboxGeneral
                data={dataRoles}
                placeholder="Seleccione un rol"
                valor={formData.id_roles}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, id_roles: value }))
                }
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field className="space-y-2">
                <Label
                  htmlFor="nombre"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="ejemplo: Juan"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="h-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                  required
                />
              </Field>

              <Field className="space-y-2">
                <Label
                  htmlFor="apellido"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                  Apellido
                </Label>
                <Input
                  id="apellido"
                  name="apellido"
                  placeholder="ejemplo: Pérez"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20"
                  required
                />
              </Field>
            </div>

            <Field className="space-y-2">
              <Label
                htmlFor="dni"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                DNI
              </Label>
              <Input
                id="dni"
                name="dni"
                type="number"
                placeholder="ejemplo: 12345678"
                value={formData.dni}
                onChange={handleInputChange}
                className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ingrese el número de DNI sin puntos ni guiones
              </p>
            </Field>

            <Field className="space-y-2">
              <Label
                htmlFor="id_rutas"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
                Ruta Asociada (Opcional)
              </Label>
              <ComboboxGeneral
                data={dataRutas}
                placeholder="Seleccione una ruta"
                valor={formData.id_rutas}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, id_rutas: value }))
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                Seleccione una ruta si este perfil está asociado a una
                específica
              </p>
            </Field>

            <Field className="space-y-2">
              <Label
                htmlFor="id_user"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-gray-500 rounded-full"></span>
                ID Usuario (Opcional)
              </Label>
              <Input
                id="id_user"
                name="id_user"
                placeholder="ejemplo: 12345678-1234-1234-1234-123456789012"
                value={formData.id_user}
                onChange={handleInputChange}
                className="h-10 border-gray-200 focus:border-gray-500 focus:ring-gray-500/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                ID del usuario del sistema de autenticación (opcional)
              </p>
            </Field>
          </div>

          <DialogFooter className="pt-4 border-t flex-shrink-0">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-10 px-6 border-gray-200 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-10 px-6 bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Guardar Perfil
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
