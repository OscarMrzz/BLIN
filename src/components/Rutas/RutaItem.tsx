"use client";

import {
  ObtenerhoraProximoBus,
  obtenerMinutosParaLlegada,
} from "@/utils/Calculos";

import { Badge } from "@/components/misUI/badge";
import { Button } from "@/components/misUI/button";
import { Card } from "@/components/misUI/card";

import Image from "next/image";
import { useEffect, useState } from "react";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
import { RutaCompletaInterface } from "@/Interfaces/rutas.interface";
import { getRutaImagen } from "@/lib/services/rutasServices";
import { useQuery } from "@tanstack/react-query";
import { Clock, Zap } from "lucide-react";
type Props = {
  ruta: RutaCompletaInterface;
};

export function RutaItem({ ruta }: Props) {
  const [horaProximoBus, setHoraProximoBus] = useState<string>("");
  const { data: imagenRuta } = useQuery({
    queryKey: ["ruta_imagen", ruta.id_rutas],
    queryFn: () => getRutaImagen(ruta.id_rutas),
  });

  const { miUbicacion } = miUbicacionStore();

  // Calcular la hora del próximo bus cuando cambian las dependencias
  const proximaHora = miUbicacion
    ? (() => {
        const minutosParaProximoViaje = obtenerMinutosParaLlegada(
          miUbicacion,
          ruta,
        );
        return minutosParaProximoViaje !== null
          ? ObtenerhoraProximoBus(minutosParaProximoViaje)
          : "";
      })()
    : "";

  useEffect(() => {
    setHoraProximoBus(proximaHora);
  }, [proximaHora]);

  const handleVerRuta = (rutaId: string) => {
    window.location.href = `rutas/${rutaId}`;
  };

  return (
    <Card className="relative mx-auto w-full max-w-sm overflow-hidden border-0 bg-linear-to-br from-slate-50 to-white shadow-xl dark:from-slate-900 dark:to-slate-800 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
        <Image
          src={`/img/${imagenRuta || "school-bus"}.png`}
          alt="Bus cover"
          className="h-full w-full object-contain p-4"
          width={500}
          height={300}
          priority
        />

        {/* Floating Badge */}
        <div className="absolute top-4 right-4 z-30">
          <Badge className="bg-white/90 text-black backdrop-blur-sm font-semibold shadow-lg">
            Activo
          </Badge>
        </div>
      </div>

      {/* Content Section - flex grow to push button to bottom */}
      <div className="px-6 pb-6 flex flex-col flex-grow">
        <div className="pt-4 flex-grow">
          {/* Title with Modern Typography */}
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            {ruta.nombre}
          </h3>

          {/* Info Pills */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              <Zap className="h-4 w-4" />
              <span>$15</span>
            </div>

            {horaProximoBus && (
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <Clock className="h-4 w-4" />
                <span>{horaProximoBus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button - always at bottom */}
        <div className="mt-auto">
          <Button
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => handleVerRuta(ruta.id_rutas)}
          >
            Ver Ruta
          </Button>
        </div>
      </div>
    </Card>
  );
}
