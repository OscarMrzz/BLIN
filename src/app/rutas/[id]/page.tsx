"use client";
import React from "react";
import dynamic from "next/dynamic";

import { getRutaById } from "@/lib/services/rutasServices";
import { getHorariosByIdRuta } from "@/lib/services/horariosServices";
import { useQuery } from "@tanstack/react-query";

const MapComponent = dynamic(() => import("@/components/Map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-100 animate-pulse flex items-center justify-center">
      Cargando mapa...
    </div>
  ),
});
type Props = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: Props) {
  const { id } = React.use(params);

  const {
    data: ruta,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["rutaBuscada", id],
    queryFn: () => getRutaById(id),
  });

  const {
    data: horarios,
    isLoading: horariosLoading,
    isError: horariosError,
  } = useQuery({
    queryKey: ["horariosRuta", id],
    queryFn: () => getHorariosByIdRuta(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col px-2">
        <h2 className="text-2xl font-black text-slate-600 mb-4">Cargando...</h2>
        <div className="w-full h-120 rounded-2xl shadow bg-slate-50"></div>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {error?.message || "Error desconocido"}</div>;
  }

  if (!ruta) {
    return <div>Ruta no encontrada</div>;
  }

  // Validar que las coordenadas sean válidas
  if (
    !ruta.punto_origen?.latitud ||
    !ruta.punto_origen?.longitud ||
    !ruta.punto_destino?.latitud ||
    !ruta.punto_destino?.longitud
  ) {
    return (
      <div className="p-4 w-full">
        <h2 className="text-2xl font-black text-slate-600 mb-4">
          {ruta.nombre || "Ruta no encontrada"}
        </h2>
        <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg w-full p-8 text-center">
          <p className="text-red-500">
            Las coordenadas de la ruta no están disponibles
          </p>
        </div>
      </div>
    );
  }

  // Crear objeto con punto de inicio y final para el mapa usando coordenadas reales
  const puntosRuta = {
    inicio: {
      id_paradas: ruta.id_rutas + "_origen",
      latitud: Number(ruta.punto_origen.latitud),
      longitud: Number(ruta.punto_origen.longitud),
      nombre_lugar: ruta.origen,
    },
    final: {
      id_paradas: ruta.id_rutas + "_destino",
      latitud: Number(ruta.punto_destino.latitud),
      longitud: Number(ruta.punto_destino.longitud),
      nombre_lugar: ruta.destino,
    },
  };

  // Convertir a array para el MapComponent
  const puntosMapa = [puntosRuta.inicio, puntosRuta.final];

  // Obtener hora actual en minutos para comparación
  const getCurrentTimeInMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const currentTimeInMinutes = getCurrentTimeInMinutes();

  return (
    <div className="p-4 w-full ">
      {/* Header con información principal */}
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-600 mb-3">
          {ruta?.nombre || "Ruta no encontrada"}
        </h2>

        <div className="flex flex-wrap gap-4 text-sm">
          {/* Precio */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Precio:</span>
            <span className="font-semibold text-slate-700">
              L{ruta?.precio || "N/A"}
            </span>
          </div>

          {/* Tiempo hasta próximo bus */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Próximo bus en:</span>
            <span className="font-semibold text-green-600">
              {horarios && horarios.length > 0
                ? (() => {
                    const horariosFuturos = horarios
                      .filter((h) => (h.horario || 0) >= currentTimeInMinutes)
                      .sort((a, b) => (a.horario || 0) - (b.horario || 0));

                    if (horariosFuturos.length > 0) {
                      const proximoHorario = horariosFuturos[0].horario || 0;
                      const minutosRestantes =
                        proximoHorario - currentTimeInMinutes;

                      if (minutosRestantes <= 0) {
                        return "Ahora";
                      } else if (minutosRestantes < 60) {
                        return `${minutosRestantes} min`;
                      } else {
                        const horas = Math.floor(minutosRestantes / 60);
                        const minutos = minutosRestantes % 60;
                        return `${horas}h ${minutos}min`;
                      }
                    } else {
                      // Si no hay horarios futuros hoy, buscar el primero del día siguiente
                      const primerHorario = horarios.sort(
                        (a, b) => (a.horario || 0) - (b.horario || 0),
                      )[0];

                      if (primerHorario) {
                        const minutosMañana =
                          24 * 60 -
                          currentTimeInMinutes +
                          (primerHorario.horario || 0);
                        const horas = Math.floor(minutosMañana / 60);
                        const minutos = minutosMañana % 60;
                        return `${horas}h ${minutos}min`;
                      }
                      return "No disponible";
                    }
                  })()
                : "No disponible"}
            </span>
          </div>

    
  
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg w-full">
        {/* 2. Colocación del componente */}
        <MapComponent puntos={puntosMapa} />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Horarios</h2>

        {horariosLoading ? (
          <div className="text-center py-4">
            <p className="text-slate-500">Cargando horarios...</p>
          </div>
        ) : horariosError ? (
          <div className="text-center py-4">
            <p className="text-red-500">Error al cargar los horarios</p>
          </div>
        ) : horarios && horarios.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {horarios
              .sort((a, b) => (a.horario || 0) - (b.horario || 0))
              .map((horario) => {
                const minutosTotales = horario.horario || 0;
                const horas = Math.floor(minutosTotales / 60);
                const minutos = minutosTotales % 60;
                const periodo = horas >= 12 ? "pm" : "am";
                const hora12 =
                  horas > 12 ? horas - 12 : horas === 0 ? 12 : horas;

                // Determinar el estilo basado en la hora actual
                let cardStyle =
                  "bg-slate-100 rounded-lg px-3 py-2 text-center transition-colors ";
                let textStyle = "font-semibold ";

                if (minutosTotales < currentTimeInMinutes) {
                  // Hora ya pasó - más tenue
                  cardStyle += "bg-slate-50 opacity-60 hover:bg-slate-100";
                  textStyle += "text-slate-400";
                } else {
                  // Encontrar el próximo horario que no ha pasado
                  const horariosFuturos = horarios
                    .filter((h) => (h.horario || 0) >= currentTimeInMinutes)
                    .sort((a, b) => (a.horario || 0) - (b.horario || 0));

                  if (
                    horariosFuturos.length > 0 &&
                    horariosFuturos[0].id_horarios === horario.id_horarios
                  ) {
                    // Próximo horario a pasar - verde
                    cardStyle +=
                      "bg-green-100 border-2 border-green-300 hover:bg-green-200 shadow-md";
                    textStyle += "text-green-700";
                  } else {
                    // Hora futura - estilo normal
                    cardStyle += "bg-slate-100 hover:bg-slate-200";
                    textStyle += "text-slate-700";
                  }
                }

                return (
                  <div key={horario.id_horarios} className={cardStyle}>
                    <p className={textStyle}>
                      {hora12.toString().padStart(2, "0")}:
                      {minutos.toString().padStart(2, "0")} {periodo}
                    </p>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-slate-500">
              No hay horarios disponibles para esta ruta
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
