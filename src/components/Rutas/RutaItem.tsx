"use client";





import {
  obtenerDistanciaCarretera,
  ObtenerhoraProximoBus,
  obtenerMinutosParaLlegada,
} from "@/utils/Calculos";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { rutaInterface } from "@/Interfaces/rutas.iterface";
import Image from "next/image";
import { useEffect, useState } from "react";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
type Props = {
  ruta: rutaInterface;
};



export function RutaItem({ ruta }: Props) {
    const [horaProximoBus, setHoraProximoBus] = useState<string>("");
    const [tiempoProximoAutoBus, setTiempoProximoAutoBus] = useState<string>("");
    
  
    const { miUbicacion } = miUbicacionStore();
    useEffect(() => {
     
  
      if (!miUbicacion) return;
      const minutosParaProximoViaje = obtenerMinutosParaLlegada(
        miUbicacion,
        ruta,
      );
  
      if (minutosParaProximoViaje !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTiempoProximoAutoBus(`${minutosParaProximoViaje} minutos`);
        const hora = ObtenerhoraProximoBus(minutosParaProximoViaje);
        setHoraProximoBus(hora);
      }
    }, [ruta, miUbicacion]);

const handleVerRuta = (rutaId: number) => {
  window.location.href = `rutas/${rutaId}`;
};


  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35 " />
      <Image
        src="/img/busFino.png"
        alt="Bus cover"
        className="relative z-20 w-full h-48 object-cover "
        width={500}
        height={300}
        priority
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>{ruta.nombre}</CardTitle>
        <CardDescription className="flex flex-col">
          <span>Precio: L 37.00</span>
          <span>{horaProximoBus}</span>
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => handleVerRuta(Number(ruta.id_rutas))}
        >
          Ver Ruta
        </Button>
      </CardFooter>
    </Card>
  );
}
