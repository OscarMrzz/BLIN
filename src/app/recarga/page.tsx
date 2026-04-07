"use client";
import ComboboxGeneral from "@/components/Comobox/ComboboxGeneral";
import { Button } from "@/components/misUI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/misUI/card";
import { Field, FieldGroup } from "@/components/misUI/field";
import { Input } from "@/components/misUI/input";
import { Label } from "@/components/misUI/label";
import {
  getSaldoForTarjeta,
  recargarTarjeta,
} from "@/lib/services/saldoServices";
import { getAllTarjetas } from "@/lib/services/tarjetasServices";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, CreditCardIcon } from "lucide-react";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";

export default function RecargaPage() {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [saldoActual, setSaldoActual] = useState(7);

  const {
    data: tarjetasList,

    isError,
    error,
  } = useQuery({ queryKey: ["getAllTarjetas"], queryFn: getAllTarjetas });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !cantidad) {
      toast.error("Por favor, complete todos los campos");
      return;
    }

    console.log("ID de tarjeta seleccionada:", codigo);
    console.log("Tarjetas disponibles:", tarjetasList);

    const tarjetaEncontrada = tarjetasList?.find(
      (t) => t.id_targetas === codigo,
    );

    console.log("Tarjeta encontrada:", tarjetaEncontrada);

    if (!tarjetaEncontrada) {
      toast.error("Tarjeta no encontrada");
      return;
    }
    try {
      await recargarTarjeta(
        tarjetaEncontrada.id_targetas,
        parseFloat(cantidad),
      );
      toast.success("Recarga procesada exitosamente");

      // Refrescar el saldo después de la recarga
      await seleccionarTarjeta(codigo);
      setCantidad(""); // Limpiar el campo de cantidad
    } catch (error) {
      toast.error("Error al recargar la tarjeta");
    }
  };

  const seleccionarTarjeta = async (idTarjeta: string) => {
    console.log("Seleccionando tarjeta con ID:", idTarjeta);
    setCodigo(idTarjeta);
    const tarjetaEncontrada = tarjetasList?.find(
      (t) => t.id_targetas === idTarjeta,
    );

    console.log("Tarjeta encontrada en selección:", tarjetaEncontrada);

    if (!tarjetaEncontrada) {
      setSaldoActual(0);
      return;
    }

    const saldos = await getSaldoForTarjeta(tarjetaEncontrada.id_targetas);
    if (saldos && saldos.length > 0) {
      setSaldoActual(saldos[0].saldo_total);
    } else {
      setSaldoActual(0);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 justify-center items-center w-full flex flex-col">
      <div className="flex items-center gap-2">
        <CreditCardIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Recarga</h1>
      </div>

      <Card className=" w-md">
        <CardHeader>
          <CardTitle>Recargar Saldo</CardTitle>
          <CardDescription>
            Ingresa el código de la tarjeta y la cantidad a recargar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <Label htmlFor="id_rutas">Ruta:</Label>

                <ComboboxGeneral
                  data={
                    tarjetasList?.map((tarjeta) => ({
                      value: tarjeta.id_targetas,
                      label: tarjeta.codigo_targeta.toString(),
                    })) || []
                  }
                  placeholder="Seleccione una ruta"
                  valor={codigo}
                  onValueChange={(value) => seleccionarTarjeta(value)}
                />
              </Field>

              <Field className="w-24">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder=""
                  min="1"
                  required
                />
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              Procesar Recarga
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toaster />

      <div>
        <span>Saldo Actual: {saldoActual}</span>
      </div>
    </div>
  );
}
