"use client";
import RutaItem from "@/components/Rutas/RutaItem";

import Image from "next/image";
import { useEffect, useState } from "react";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
import { useQuery } from "@tanstack/react-query";
import { getAllRutas } from "@/services/rutasServices";
import {
  obtenerDistanciaCarretera,
  ObtenerhoraProximoBus,
  obtenerMinutosParaLlegada,
} from "@/utils/Calculos";
import CargaCell from "@/components/Animaciones/Carga/cargaCell";

export default function Home() {
  // Queries
  const {
    data: rutasList,
   
    isError,
    error,
  } = useQuery({ queryKey: ["rutas"], queryFn: getAllRutas });

  const { setMiUbicacion, miUbicacion } = miUbicacionStore();
  const [tiempoProximoAutoBus, setTiempoProximoAutoBus] = useState<string>("");
  const [horaProximoBus, setHoraProximoBus] = useState<string>("");

  useEffect(() => {
    console.log("iniciando Calculos");
    if (!rutasList || rutasList.length < 2 || !miUbicacion) return;
    const minutosParaProximoViaje = obtenerMinutosParaLlegada(
      miUbicacion,
      rutasList[1],
    );
    console.log("finalizamos calculos");
    console.log({
      miUbicacion: miUbicacion.latitud,
      ruta: rutasList[1].nombre,
      ditancia: miUbicacion.distanciaDesdeOrigen,
      tiempoProximoBus: minutosParaProximoViaje,
    });

    if (minutosParaProximoViaje !== null) {
      setTiempoProximoAutoBus(`${minutosParaProximoViaje} minutos`);
      const hora = ObtenerhoraProximoBus(minutosParaProximoViaje);
      setHoraProximoBus(hora);
    }
  }, [rutasList, miUbicacion]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Tu navegador no soporta geolocalización");

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

      console.warn("Error de geolocalización:", errorMessage);
    };

    const obtenerUbicacion = async () => {
      // Verificar que rutasList esté disponible y tenga al menos 2 elementos
      if (!rutasList || rutasList.length < 2) {
        console.warn("Rutas no disponibles para calcular distancia");
        return;
      }

      try {
        const distancia = await obtenerDistanciaCarretera(
          {
            latitud: 15.551719134171245,
            longitud: -87.65120082503267,
          },
          {
            latitud: rutasList[1].punto_origen.latitud,
            longitud: rutasList[1].punto_origen.longitud,
          },
        );

        setMiUbicacion({
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
          distanciaDesdeOrigen: distancia,
        });

        console.log("Ubicación obtenida", {
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
          distanciaDesdeOrigen: distancia,
        });
      } catch (error) {
        console.error("Error al obtener ubicación:", error);
        // Establecer ubicación sin distancia si falla el cálculo
        setMiUbicacion({
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
          distanciaDesdeOrigen: 0,
        });
      }
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
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

  if (!horaProximoBus) {
    return (
      <div className=" h-full w-full flex flex-col gap-8  ">
        <div className="w-full  flex justify-center animate-zoom-in   ">
          <Image
            src="/logo2/logoCompleto.png"
            alt="Logo de la aplicación"
            width={100}
            height={100}
            priority
            className="w-auto h-auto border-2" // Fuerza a mantener el aspect ratio si hay estilos externos
            style={{ width: "auto", height: "auto" }} // Refuerzo para eliminar la advertencia de Next.js
          />
        </div>
           <div className="flex flex-col h-full w-full ">
              <div className="animate-jelly delay-100 h-full w-full">
                <CargaCell />
              </div>
              <div className="text-cyan-600">
                <p>Revisando rutas..</p>
              </div>
            </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col  h-full w-full  mx-auto  gap-2 ">
      <div className="w-full h-full   items-center flex flex-col gap-4 ">
        <div className="w-full h-60 flex justify-center animate-zoom-in  delay-150">
          <Image
            src="/logo2/logoCompleto.png"
            alt="Logo de la aplicación"
            width={100}
            height={100}
            priority
            className="w-auto h-auto border-2" // Fuerza a mantener el aspect ratio si hay estilos externos
            style={{ width: "auto", height: "auto" }} // Refuerzo para eliminar la advertencia de Next.js
          />
        </div>
        <div className="">
     
            <div className="animate-zoom-in ">
              <div className="text-cyan-600">
                <p>Proximo Autobus</p>
              </div>
              <div className="text-6xl text-slate-700 font-bold">
                {horaProximoBus}
              </div>
              <p>{tiempoProximoAutoBus || ""}</p>
            </div>
     
        </div>
      </div>
      <section className="animate-fade-in-up delay-75 ">

      <div className="bg-orange-500  rounded-t-md h-12 p-2 mb-2">
        <h2 className="text-2xl font-bold text-slate-200">
          Rutas en tu ubicacion
        </h2>
      </div> 
      <div className="flex flex-col w-full h-120 min-h-120 overflow-y-auto gap-2 pb-48 px-2 lg:px-8 ">
        {rutasList?.map((ruta) => (
          <RutaItem key={ruta.id_rutas} ruta={ruta} />
        ))}
      </div>
        </section>

    </div>

  );
}
