"use client";
import { Button } from "@/components/misUI/button";
import { TargetasInterface } from "@/Interfaces/targetas.interface";
import { cobrarPasaje } from "@/lib/services/saldoServices";
import { getTarjetaById } from "@/lib/services/tarjetasServices";
import React, { useEffect, useState } from "react";
import { CreditCard, CheckCircle, AlertCircle, Loader } from "lucide-react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: Props) {
  const { id } = React.use(params);
  const [tarjeta, setTarjeta] = useState<TargetasInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTarjeta = async () => {
      try {
        const tarjetaData = await getTarjetaById(id);
        setTarjeta(tarjetaData);
      } catch (error) {
        console.error("Error al obtener la tarjeta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTarjeta();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">
            Cargando información de la tarjeta...
          </p>
        </div>
      </div>
    );
  }

  const cobrar = async () => {
    if (!tarjeta) return;

    setProcessing(true);
    setError(null);

    try {
      await cobrarPasaje(tarjeta.id_targetas, 5);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Error al procesar el cobro. Intente nuevamente.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">Cobro de Pasaje</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Sistema de cobro electrónico
          </p>
        </div>

        {/* Main Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium mb-2">
                  Tarjeta de Transporte
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
                  <p className="text-white text-2xl font-mono font-bold tracking-wider">
                    {tarjeta?.codigo_targeta || "XXXXXXX"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {/* Status Messages */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">
                      ¡Cobro procesado exitosamente!
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Amount Display */}
              <div className="text-center mb-8">
                <p className="text-sm text-muted-foreground mb-2">
                  Monto a cobrar
                </p>
                <div className="inline-flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">L</span>
                  <span className="text-5xl font-bold text-primary">37</span>
                </div>
              </div>

              {/* Cobrar Button */}
              <Button
                onClick={cobrar}
                disabled={processing}
                className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span>Cobrar Pasaje</span>
                  </div>
                )}
              </Button>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-sm text-muted-foreground">
                  <p>El monto será descontado automáticamente</p>
                  <p>del saldo de la tarjeta</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
              <AlertCircle className="w-5 h-5 text-sky-600" />
              <p className="text-sm text-gray-700">
                Verifique que la tarjeta tenga saldo suficiente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
