"use client";
import { RutaItem } from "@/components/Rutas/RutaItem";

import Image from "next/image";
import { useEffect, useState } from "react";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
import { useQuery } from "@tanstack/react-query";
import { getAllRutas } from "@/lib/services/rutasServices";
import {
  obtenerDistanciaCarretera,
  ObtenerhoraProximoBus,
  obtenerMinutosParaLlegada,
} from "@/utils/Calculos";
import CargaCell from "@/components/Animaciones/Carga/cargaCell";


import {
  displaySchemaInfo,
  getSchemaInfo,
} from "@/lib/services/SchemaServices";
import HiroComponent from "@/components/Hiro/HiroComponent";

export default function Home() {
  const {
    data: rutasList,

    isError,
    error,
  } = useQuery({ queryKey: ["rutas"], queryFn: getAllRutas });

  const { setMiUbicacion, miUbicacion } = miUbicacionStore();
  const [tiempoProximoAutoBus, setTiempoProximoAutoBus] = useState<string>("");
  const [horaProximoBus, setHoraProximoBus] = useState<string>("");

  useEffect(() => {
    if (!rutasList || rutasList.length < 2 || !miUbicacion) return;
    const minutosParaProximoViaje = obtenerMinutosParaLlegada(
      miUbicacion,
      rutasList[1],
    );

    if (minutosParaProximoViaje !== null) {
      setTiempoProximoAutoBus(`${minutosParaProximoViaje} minutos`);
      const hora = ObtenerhoraProximoBus(minutosParaProximoViaje);
      setHoraProximoBus(hora);
    }
  }, [rutasList, miUbicacion]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    // Manejar errores de Tracking Prevention y otros errores de geolocalización
    const handleGeolocationError = (err: GeolocationPositionError) => {
      let errorMessage = `Error: ${err.message}`;

      // Mensajes específicos para errores comunes
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage =
            "Permiso de geolocalización denegado. Por favor, habilita el acceso a tu ubicación.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Información de ubicación no disponible.";
          break;
        case err.TIMEOUT:
          errorMessage = "Tiempo de espera agotado al obtener la ubicación.";
          break;
      }
    };

    const obtenerUbicacion = async () => {
      try {
        let distancia = 1;
        console.log("Ditancia Inicial:", distancia);
        const miPosicionDePrueba = {
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
        };

        if (rutasList && rutasList.length >= 2) {
          console.log("Logro entrar✅✅✅");
          console.log(rutasList[1]);
          const rutaOrigenDePrueba = {
            latitud: rutasList[1].punto_origen.latitud,
            longitud: rutasList[1].punto_origen.longitud,
          };
          distancia = await obtenerDistanciaCarretera(
            miPosicionDePrueba,
            rutaOrigenDePrueba,
          );
        }

        console.log("Ditancia Despues de calculos:", distancia);
        setMiUbicacion({
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
          distanciaDesdeOrigen: distancia,
        });
      } catch (error) {
        // Establecer ubicación sin distancia si falla el cálculo
        setMiUbicacion({
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
          distanciaDesdeOrigen: 0,
        });
      }
    };

    navigator.geolocation.getCurrentPosition(
      async () => {
        await obtenerUbicacion();
      },
      handleGeolocationError,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  }, [setMiUbicacion, rutasList]);

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (!rutasList || rutasList.length === 0) {
    return (
      <div className=" h-full w-full flex flex-col gap-8  ">
        <div className="w-full  flex justify-center animate-zoom-in   ">
          <Image
            src="/logo2/logoCompleto.png"
            alt="Logo de la aplicación"
            width={100}
            height={100}
            priority
            className="w-auto h-auto " // Fuerza a mantener el aspect ratio si hay estilos externos
            style={{ width: "auto", height: "auto" }} // Refuerzo para eliminar la advertencia de Next.js
          />
        </div>
        <div className="flex flex-col h-full w-full ">
          <div className="animate-jelly delay-100 h-full w-full">
            <CargaCell />
          </div>
          <div className="text-cyan-600">
            <p>Cargando rutas..</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen ">
      <HiroComponent horaProximoBus={horaProximoBus} tiempoProximoAutoBus={tiempoProximoAutoBus} />
 
      <section className="animate-fade-in-up delay-75 w-full px-4">
        <div className="bg-orange-500 rounded-t-md h-12 p-2 mb-2 flex lg:hidden ">
          <h2 className="text-2xl font-bold text-slate-200">
            Rutas en tu ubicacion
          </h2>
        </div>
        <div className="grid grid-cols-1 pt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 w-full gap-4 pb-48">
          {rutasList?.map((ruta) => (
            <RutaItem key={ruta.id_rutas} ruta={ruta} />
          ))}
        </div>
      </section>
    </div>
  );
}
