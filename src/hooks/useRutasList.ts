import { vista_completa_rutas } from "@/lib/services/rutasServices";
import { ObtenerhoraProximoBus } from "@/utils/Calculos";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { obtenerMinutosParaLlegada } from "@/utils/Calculos";
import { miUbicacionStore } from "@/Store/miUbicacionStore";

export function useRutasList() {
    const { setMiUbicacion, miUbicacion } = miUbicacionStore();
    const {
        data: rutasList,

        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["vista_completa_rutas"],
        queryFn: vista_completa_rutas,
    });

    // Calcular y ordenar rutas por tiempo de espera usando useMemo
    const rutasOrdenadas = useMemo(() => {
        if (!rutasList || rutasList.length === 0 || !miUbicacion) {
            return [];
        }

        // Calcular tiempo de espera para cada ruta y ordenarlas
        const rutasConTiempo = rutasList.map(ruta => {
            const minutosParaLlegada = obtenerMinutosParaLlegada(miUbicacion, ruta);
            return {
                ...ruta,
                minutosParaLlegada: minutosParaLlegada !== null ? minutosParaLlegada : Infinity
            };
        });

        // Ordenar rutas por tiempo de espera (menor tiempo primero)
        return rutasConTiempo.sort((a, b) => a.minutosParaLlegada - b.minutosParaLlegada);
    }, [rutasList, miUbicacion]);

    // Calcular tiempo para el próximo bus usando useMemo
    const { tiempoProximoAutoBus, horaProximoBus } = useMemo(() => {
        if (rutasOrdenadas.length === 0) {
            return { tiempoProximoAutoBus: "", horaProximoBus: "" };
        }

        const rutaMasCercana = rutasOrdenadas[0];
        if (rutaMasCercana.minutosParaLlegada !== Infinity) {
            const tiempo = `${rutaMasCercana.minutosParaLlegada} minutos`;
            const hora = ObtenerhoraProximoBus(rutaMasCercana.minutosParaLlegada);
            return { tiempoProximoAutoBus: tiempo, horaProximoBus: hora };
        }

        return { tiempoProximoAutoBus: "", horaProximoBus: "" };
    }, [rutasOrdenadas]);

    return {
        rutasList: rutasOrdenadas, // Devolver las rutas ordenadas en lugar de las originales
        rutasOriginales: rutasList, // Mantener las rutas originales si se necesitan
        isError,
        error,
        isLoading,
        tiempoProximoAutoBus,
        horaProximoBus,
    };
}
