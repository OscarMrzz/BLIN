"use client";

import React, { useEffect, useState } from "react";
import GeneradorQRComponnet from "@/components/Formularios/qr/GeneradorQRComponnet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  asignarQR,
  getAllTarjetas,
  getTarjetasNoAsignadas,
} from "@/lib/services/tarjetasServices";
import { tablaInterface } from "@/Interfaces/tabla.interface";
import { TargetasInterface } from "@/Interfaces/targetas.interface";
import ComboboxGeneral from "@/components/Comobox/ComboboxGeneral";
import { useQuery } from "@tanstack/react-query";

export default function Page() {
  const dominio = "https://blin-hn.duckdns.org/";
  const paginaDeCobro = "cobrador/cobro/";
  const [url, setUrl] = useState("");
  const [codigo, setCodigo] = useState("123");
  const [idTarjeta, setIdTarjeta] = useState("");
  const [mostrarQR, setMostrarQR] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] =
    useState<TargetasInterface>();

  const {
    data: tarjetasList,

    isError,
    error,
  } = useQuery({
    queryKey: ["getTarjetasNoAsignadas"],
    queryFn: getTarjetasNoAsignadas,
  });

  const dataTarjetas = React.useMemo(
    () =>
      tarjetasList?.map((tarjeta) => ({
        value: tarjeta.id_targetas,
        label: tarjeta.codigo_targeta,
      })) || [],
    [tarjetasList],
  );

  const handleGenerar = async () => {
    if (url.trim() && codigo.trim() && idTarjeta) {
      setMostrarQR(true);
      await asignarQR(idTarjeta);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generador de QR</h1>
          <p className="text-muted-foreground">
            Genera códigos QR con URL personalizada y código identificador
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurar QR</CardTitle>
            <CardDescription>
              Ingresa la URL y el código para generar el código QR
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ComboboxGeneral
              data={dataTarjetas}
              placeholder="Seleccione una tarjeta"
              valor={idTarjeta}
              onValueChange={(value) => {
                setIdTarjeta(value);
                const tarjetaSeleccionada = tarjetasList?.find(
                  (t) => t.id_targetas === value,
                );
                if (tarjetaSeleccionada) {
                  setCodigo(tarjetaSeleccionada.codigo_targeta);
                  setTarjetaSeleccionada(tarjetaSeleccionada);
                  setUrl(`${dominio}${paginaDeCobro}${value}`);
                }
              }}
            />

            <div className="space-y-2">
              <label htmlFor="qr-url" className="text-sm font-medium">
                URL del QR
              </label>
              <Input
                id="qr-url"
                placeholder="http://tuweb/"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="qr-tarjeta" className="text-sm font-medium">
                Seleccionar Tarjeta
              </label>
            </div>
            <Button onClick={handleGenerar} className="w-full">
              Generar QR
            </Button>
          </CardContent>
        </Card>

        {mostrarQR && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Código QR Generado</h2>
            <Card>
              <CardContent className="flex justify-center p-6">
                <GeneradorQRComponnet url={url} codigo={codigo} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
