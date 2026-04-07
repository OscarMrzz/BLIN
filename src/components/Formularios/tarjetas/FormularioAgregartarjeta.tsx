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
import { Field, FieldGroup, FieldLabel } from "@/components/misUI/field";
import { Label } from "@/components/misUI/label";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast, Toaster } from "sonner";
import { useRef, useState, useEffect } from "react";
import { createMultipleTarjetas } from "@/lib/services/tarjetasServices";
import { Input } from "@/components/misUI/input";
import { Checkbox } from "@/components/misUI/checkbox";
import ComboboxGeneral from "@/components/Comobox/ComboboxGeneral";
import { getAllPerfiles } from "@/lib/services/perfilesServices";
import { PerfilesInterface } from "@/Interfaces/roles.interface";

type FormData = {
  cantidad: string;
  asignarUsuario: boolean;
  id_perfil: string;
};

type Props = {
  refrescarTabla: () => void;
};

export function AgregarTarjeta({ refrescarTabla }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Estado inicial para generación masiva
  const [formData, setFormData] = React.useState<FormData>({
    cantidad: "",
    asignarUsuario: false,
    id_perfil: "",
  });

  const [usuarios, setUsuarios] = useState<PerfilesInterface[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [generando, setGenerando] = useState(false);

  // Cargar usuarios para el combobox
  useEffect(() => {
    const cargarUsuarios = async () => {
      if (formData.asignarUsuario) {
        setLoadingUsuarios(true);
        try {
          const usuariosData = await getAllPerfiles();
          setUsuarios(usuariosData);
        } catch (error) {
          console.error("Error al cargar usuarios:", error);
          toast.error("Error al cargar usuarios");
        } finally {
          setLoadingUsuarios(false);
        }
      }
    };

    cargarUsuarios();
  }, [formData.asignarUsuario]);

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();

    // Validaciones
    const cantidad = parseInt(formData.cantidad);
    if (!formData.cantidad.trim() || isNaN(cantidad) || cantidad <= 0) {
      toast.error("Por favor ingrese una cantidad válida mayor a 0", {
        duration: 3000,
      });
      return;
    }

    if (cantidad > 100) {
      toast.error("La cantidad máxima permitida es 100 tarjetas", {
        duration: 3000,
      });
      return;
    }

    if (formData.asignarUsuario && !formData.id_perfil) {
      toast.error("Por favor seleccione un usuario", {
        duration: 3000,
      });
      return;
    }

    setGenerando(true);

    try {
      const resultado = await createMultipleTarjetas(
        cantidad,
        formData.asignarUsuario ? formData.id_perfil : undefined,
      );

      if (resultado.errores.length > 0) {
        toast.warning(
          `Se crearon ${resultado.exitosas.length} tarjetas con advertencias`,
        );
        console.warn("Errores:", resultado.errores);
      } else {
        toast.success(
          `Se crearon ${resultado.exitosas.length} tarjetas exitosamente`,
        );
      }

      // Resetear formulario
      setFormData({
        cantidad: "",
        asignarUsuario: false,
        id_perfil: "",
      });

      closeRef.current?.click();
      refrescarTabla();
    } catch (error) {
      console.error("Error al generar tarjetas:", error);

      let errorMessage = "Error al generar tarjetas";

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
    } finally {
      setGenerando(false);
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
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-green-600" />
              </div>
              Agregar Nuevas Tarjetas
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Genere múltiples tarjetas para el sistema de transporte.
            </p>
          </DialogHeader>

          <FieldGroup className="space-y-6 pb-8">
            <Field className="space-y-2">
              <Label
                htmlFor="cantidad"
                className="text-sm font-medium flex items-center gap-2"
              >
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Cantidad de Tarjetas
              </Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                max="100"
                placeholder="Ingrese la cantidad (1-100)"
                value={formData.cantidad}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cantidad: e.target.value,
                  }))
                }
                disabled={generando}
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Límite máximo: 100 tarjetas por operación
              </p>
            </Field>

            <Field className="space-y-3">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Checkbox
                  className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500"
                  id="asignarUsuario"
                  checked={formData.asignarUsuario}
                  onCheckedChange={(checked: boolean) => {
                    setFormData((prev) => ({
                      ...prev,
                      asignarUsuario: checked,
                      id_perfil: checked ? prev.id_perfil : "",
                    }));
                  }}
                  disabled={generando}
                />
                <FieldLabel
                  htmlFor="asignarUsuario"
                  className="text-sm font-medium cursor-pointer"
                >
                  Asignar a un usuario específico
                </FieldLabel>
              </div>
            </Field>

            {formData.asignarUsuario && (
              <Field className="space-y-2">
                <Label
                  htmlFor="usuario"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                  Usuario Asignado
                </Label>
                {loadingUsuarios ? (
                  <div className="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Cargando usuarios...
                    </div>
                  </div>
                ) : (
                  <ComboboxGeneral
                    data={usuarios.map((usuario) => ({
                      value: usuario.id_perfiles || "",
                      label: `${usuario.nombre} ${usuario.apellido || ""}`,
                    }))}
                    placeholder="Seleccione un usuario"
                    valor={formData.id_perfil}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, id_perfil: value }))
                    }
                  />
                )}
              </Field>
            )}
          </FieldGroup>

          <DialogFooter className="pt-6 border-t">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-11 px-6 border-gray-200 hover:bg-gray-50"
                disabled={generando}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={generando}
              className="h-11 px-6 bg-green-600 hover:bg-green-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generando ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generando...
                </div>
              ) : (
                "Generar Tarjetas"
              )}
            </Button>
            <DialogClose ref={closeRef} className="hidden" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
