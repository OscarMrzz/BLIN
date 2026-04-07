"use client";

import {
  ObtenerhoraProximoBus,
  obtenerMinutosParaLlegada,
} from "@/utils/Calculos";

import { Badge } from "@/components/misUI/badge";
import { Button } from "@/components/misUI/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/misUI/card";

import Image from "next/image";
import { useEffect, useState } from "react";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
import { RutaCompletaInterface } from "@/Interfaces/rutas.interface";
type Props = {
  ruta: RutaCompletaInterface;
};

export function RutaItem({ ruta }: Props) {
  const [horaProximoBus, setHoraProximoBus] = useState<string>("");

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
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35  h-48 " />
      <div className="bg-linear-to-b from-sky-500/75 to-transparent">
        <Image
          src="/img/microbus.png"
          alt="Bus cover"
          className="relative z-20 w-full h-48  p-4 overflow-hidden "
          width={500}
          height={300}
          priority
        />
      </div>

      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>{ruta.nombre}</CardTitle>
        <CardDescription className="flex flex-col">
          <span>Velocidad: {ruta.velocidad} km/h</span>
          <span>{horaProximoBus}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full" onClick={() => handleVerRuta(ruta.id_rutas)}>
          Ver Ruta
        </Button>
      </CardFooter>
    </Card>
  );
}
