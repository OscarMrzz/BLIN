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
import {
  PlusIcon,
  CreditCardIcon,
  WalletIcon,
  TrendingUpIcon,
  Loader2Icon,
} from "lucide-react";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";

export default function RecargaPage() {
  const [codigo, setCodigo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [saldoActual, setSaldoActual] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

    const tarjetaEncontrada = tarjetasList?.find(
      (t) => t.id_targetas === codigo,
    );

    if (!tarjetaEncontrada) {
      toast.error("Tarjeta no encontrada");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
              <CreditCardIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Recarga de Saldo
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Recarga tu tarjeta de forma rápida y segura
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-5 w-5" />
                  <CardTitle className="text-white">Saldo Actual</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  L{saldoActual.toFixed(2)}
                </div>
                <div className="text-blue-100 text-sm flex items-center gap-1">
                  <TrendingUpIcon className="h-4 w-4" />
                  {codigo ? "Tarjeta seleccionada" : "Selecciona una tarjeta"}
                </div>
              </CardContent>
            </Card>

            {/* Quick Amount Buttons */}
            <Card className="mt-4 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Montos Rápidos (L)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {[25, 50, 75, 100].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setCantidad(amount.toString())}
                      className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      L{amount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <PlusIcon className="h-5 w-5 text-blue-600" />
                  Nueva Recarga
                </CardTitle>
                <CardDescription>
                  Ingresa el código de la tarjeta y la cantidad a recargar
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FieldGroup>
                    <Field>
                      <Label
                        htmlFor="tarjeta"
                        className="text-base font-medium text-gray-700"
                      >
                        Tarjeta
                      </Label>
                      <ComboboxGeneral
                        data={
                          tarjetasList?.map((tarjeta) => ({
                            value: tarjeta.id_targetas,
                            label: `Tarjeta ${tarjeta.codigo_targeta}`,
                          })) || []
                        }
                        placeholder="Selecciona una tarjeta"
                        valor={codigo}
                        onValueChange={(value) => seleccionarTarjeta(value)}
                        className="w-full"
                      />
                    </Field>

                    <Field>
                      <Label
                        htmlFor="cantidad"
                        className="text-base font-medium text-gray-700"
                      >
                        Cantidad a Recargar
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                          L
                        </span>
                        <Input
                          id="cantidad"
                          type="number"
                          value={cantidad}
                          onChange={(e) => setCantidad(e.target.value)}
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                          required
                          className="pl-8 text-lg font-semibold"
                        />
                      </div>
                      {cantidad && parseFloat(cantidad) > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          Nuevo saldo:{" "}
                          <span className="font-semibold text-green-600">
                            L{(saldoActual + parseFloat(cantidad)).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </Field>
                  </FieldGroup>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 text-base shadow-lg transition-all duration-200 disabled:opacity-50"
                    disabled={isLoading || !codigo || !cantidad}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Procesar Recarga
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <Toaster />
      </div>
    </div>
  );
}
