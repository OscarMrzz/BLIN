"use client";
import { RutaItem } from "@/components/Rutas/RutaItem";

import Image from "next/image";
import { useEffect, useState } from "react";
import { miUbicacionStore } from "@/Store/miUbicacionStore";
import BuscarSimpleIcon from "@/Icons/BuscarSimpleIcon";
import { useQuery } from "@tanstack/react-query";
import {
  getAllRutas,
  vista_completa_rutas,
} from "@/lib/services/rutasServices";
import {
  obtenerDistanciaCarretera,
  ObtenerhoraProximoBus,
  obtenerMinutosParaLlegada,
} from "@/utils/Calculos";
import CargaCell from "@/components/Animaciones/Carga/cargaCell";

import {
  displaySchemaInfo,
  getSchemaInfo,
  getSchemaInfoJSON,
} from "@/lib/services/SchemaServices";
import HiroComponent from "@/components/Hiro/HiroComponent";
import { useRutasCercanas } from "@/hooks/useRutasSercanas";
import { SkeletonPrincipal } from "@/components/skeleton/EskelentonPrincipal";

export default function Home() {
  useEffect(() => {
    (async () => {
      await vista_completa_rutas();
    })();
  }, []);

  /*   useEffect(() => {
    getSchemaInfoJSON().then((data) => {
      console.log("✅✅✅✅✅✅✅✅");
      console.log(data);
    });
  }, []); */
  const {
    data: rutasList,

    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["vista_completa_rutas"],
    queryFn: vista_completa_rutas,
  });

  const { setMiUbicacion, miUbicacion } = miUbicacionStore();
  const [tiempoProximoAutoBus, setTiempoProximoAutoBus] = useState<string>("");
  const [horaProximoBus, setHoraProximoBus] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

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
        const miPosicionDePrueba = {
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
        };

        if (
          rutasList &&
          rutasList.length >= 2 &&
          rutasList[1].latitud &&
          rutasList[1].longitud
        ) {
          const rutaOrigenDePrueba = {
            latitud: rutasList[1].latitud,
            longitud: rutasList[1].longitud,
          };
          distancia = await obtenerDistanciaCarretera(
            miPosicionDePrueba,
            rutaOrigenDePrueba,
          );
        }

        setMiUbicacion({
          id_paradas: "ubicacion-usuario",
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
          distancia_desde_origen: distancia,
        });
      } catch (error) {
        // Establecer ubicación sin distancia si falla el cálculo
        setMiUbicacion({
          id_paradas: "ubicacion-usuario",
          latitud: 15.551719134171245,
          longitud: -87.65120082503267,
          distancia_desde_origen: 0,
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

  /*   if (isError) {
    return <div>Error: {error.message}</div>;
  } */

  if (!rutasList || rutasList.length === 0 || isLoading) {
    return (
      <div className=" h-full w-full flex flex-col gap-8  ">
        <div className="w-full  flex justify-center    ">
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
          <div className="text-cyan-600">
            <p>Cargando rutas..</p>
          </div>
          <SkeletonPrincipal />;
        </div>
      </div>
    );
  }

  // Filtrar rutas según la búsqueda
  const rutasFiltradas = rutasList?.filter(
    (ruta) =>
      ruta.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      ruta.origen?.toLowerCase().includes(busqueda.toLowerCase()) ||
      ruta.destino?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen ">
      <HiroComponent
        horaProximoBus={horaProximoBus}
        tiempoProximoAutoBus={tiempoProximoAutoBus}
      />

      <section className="animate-fade-in-up delay-75 w-full px-4">
        <div className="bg-orange-500 rounded-t-md h-12 p-2 mb-2 flex lg:hidden ">
          <h2 className="text-2xl font-bold text-slate-200">
            Rutas en tu ubicacion
          </h2>
        </div>

        {/* Barra de búsqueda */}
        <div className="w-full mb-6">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BuscarSimpleIcon size={20} Styles="text-gray-400" />
            </div>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar rutas por nombre, origen o destino..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 pt-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4 pb-48">
          {rutasFiltradas
            ?.filter(
              (ruta, index, self) =>
                index === self.findIndex((r) => r.id_rutas === ruta.id_rutas),
            )
            .map((ruta) => (
              <RutaItem key={ruta.id_rutas} ruta={ruta} />
            ))}
        </div>
      </section>
    </div>
  );
}
