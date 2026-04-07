"use client";
import { Button } from "@/components/misUI/button";
import { TargetasInterface } from "@/Interfaces/targetas.interface";
import { getTarjetaById } from "@/lib/services/tarjetasServices";
import React, { useEffect, useState } from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: Props) {
  const { id } = React.use(params);
  const [tarjeta, setTarjeta] = useState<TargetasInterface | null>(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="text-white">Cargando...</div>;
  }

  return (
    <div className="flex justify-center items-center gap-24 flex-col">
      <div className="flex flex-col text-accent-foreground">
        <span>Codigo:</span>
        <h2 className="text-4xl">{tarjeta?.codigo_targeta || "XXXXXXX"}</h2>
      </div>
      <div>
        <Button className="text-4xl h-24 w-60">Cobrar</Button>
      </div>
    </div>
  );
}
