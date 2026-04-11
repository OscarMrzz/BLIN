import { vista_completa_rutas } from "@/lib/services/rutasServices";
import { ObtenerhoraProximoBus } from "@/utils/Calculos";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { obtenerMinutosParaLlegada } from "@/utils/Calculos";
import { miUbicacionStore } from "@/Store/miUbicacionStore";

export function useRutasList() {
    const { setMiUbicacion, miUbicacion } = miUbicacionStore();
    const [tiempoProximoAutoBus, setTiempoProximoAutoBus] = useState<string>("");
    const [horaProximoBus, setHoraProximoBus] = useState<string>("");
    const {
        data: rutasList,

        isError,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["vista_completa_rutas"],
        queryFn: vista_completa_rutas,
    });


    useEffect(() => {
        if (!rutasList || rutasList.length < 2 || !miUbicacion) return;
        const minutosParaProximoViaje = obtenerMinutosParaLlegada(
            miUbicacion,
            rutasList[1],
        );

        if (minutosParaProximoViaje !== null) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTiempoProximoAutoBus(`${minutosParaProximoViaje} minutos`);
            const hora = ObtenerhoraProximoBus(minutosParaProximoViaje);
            // eslint-disable-next-line react-hooks/set-state-in-effect

            setHoraProximoBus(hora);
        }
    }, [rutasList, miUbicacion]);

    return {
        rutasList,
        isError,
        error,
        isLoading,
        tiempoProximoAutoBus,
        horaProximoBus,
    };
}
