import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { point, distance } from '@turf/turf';
import { RutaCompletaInterface } from '@/Interfaces/rutas.interface';
import { vista_completa_rutas } from '@/lib/services/rutasServices';

// Hook personalizado que carga todas las rutas y filtra las cercanas
export function useRutasCercanas(miUbicacion: { lng: number; lat: number } | null) {
    // 1. Cargar todas las rutas con React Query
    const {
        data: rutasList,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["vista_completa_rutas"],
        queryFn: vista_completa_rutas,
    });

    // 2. Procesar y filtrar rutas cercanas
    const rutasCercanas = useMemo(() => {
        if (!rutasList || !miUbicacion || rutasList.length === 0) {
            return [];
        }

        // Validar coordenadas válidas
        if (isNaN(miUbicacion.lng) || isNaN(miUbicacion.lat) ||
            miUbicacion.lng === 0 || miUbicacion.lat === 0) {
            return [];
        }

        // Agrupar puntos por ruta para crear LineStrings
        const rutasAgrupadas = new Map<string, RutaCompletaInterface[]>();

        rutasList.forEach(ruta => {
            if (!rutasAgrupadas.has(ruta.id_rutas)) {
                rutasAgrupadas.set(ruta.id_rutas, []);
            }
            rutasAgrupadas.get(ruta.id_rutas)!.push(ruta);
        });

        // Convertir cada grupo de puntos en una ruta con geometría
        const rutasConGeometria = Array.from(rutasAgrupadas.entries()).map(([, puntos]) => {
            // Ordenar puntos por horario (si está disponible) o por distancia
            const puntosOrdenados = [...puntos].sort((a, b) => {
                // Priorizar orden por horario si existe
                if (a.horario !== undefined && b.horario !== undefined) {
                    return a.horario - b.horario;
                }
                // Si no hay horario, calcular distancia desde un punto de referencia
                // para ordenarlos de forma más lógica a lo largo de la ruta
                const refLat = puntos[0].latitud;
                const refLng = puntos[0].longitud;
                const distA = Math.abs(a.latitud - refLat) + Math.abs(a.longitud - refLng);
                const distB = Math.abs(b.latitud - refLat) + Math.abs(b.longitud - refLng);
                return distA - distB;
            });

            // Crear coordenadas para el LineString [longitud, latitud]
            const coordinates = puntosOrdenados
                .filter(punto =>
                    punto.latitud !== null &&
                    punto.latitud !== undefined &&
                    punto.longitud !== null &&
                    punto.longitud !== undefined &&
                    !isNaN(punto.latitud) &&
                    !isNaN(punto.longitud)
                )
                .map(punto => [punto.longitud, punto.latitud]);

            // Obtener información de la ruta (tomar del primer punto)
            const rutaInfo = puntosOrdenados[0];

            return {
                id_rutas: rutaInfo.id_rutas,
                nombre: rutaInfo.nombre,
                origen: rutaInfo.origen,
                destino: rutaInfo.destino,
                velocidad: rutaInfo.velocidad,
                activo: rutaInfo.activo,
                puntos: puntosOrdenados,
                geometry: {
                    type: 'LineString' as const,
                    coordinates
                }
            };
        });

        // 3. Filtrar rutas cercanas usando Turf.js
        const userPoint = point([miUbicacion.lng, miUbicacion.lat]);
        const RADIO_BUSQUEDA_METROS = 100; // 100 metros de radio

        const rutasFiltradas = rutasConGeometria.filter(ruta => {
            // Skip routes with no valid coordinates
            if (!ruta.geometry.coordinates || ruta.geometry.coordinates.length === 0) {
                return false;
            }

            // Calcular distancia mínima a cualquier punto de la ruta
            // Optimización: detenerse cuando encontramos un punto cercano
            for (const [lng, lat] of ruta.geometry.coordinates) {
                // Additional validation for individual coordinates
                if (lng === null || lng === undefined || lat === null || lat === undefined ||
                    isNaN(lng) || isNaN(lat)) {
                    continue;
                }

                const rutaPoint = point([lng, lat]);
                const dist = distance(userPoint, rutaPoint, 'meters');

                // Si encontramos un punto cercano, retornar true inmediatamente
                if (dist < RADIO_BUSQUEDA_METROS) {
                    return true;
                }
            }

            // Si ningún punto está cerca, retornar false
            return false;
        });

        // 4. Devolver las rutas cercanas en el formato original
        return rutasFiltradas.map(ruta => ({
            ...ruta.puntos[0], // Tomar la información completa del primer punto
            _puntosCompletos: ruta.puntos, // Guardar todos los puntos por si necesitas
            _geometry: ruta.geometry // Guardar la geometría para uso futuro
        }));
    }, [rutasList, miUbicacion]);

    return {
        rutasCercanas,
        isLoading,
        isError,
        error,
        todasLasRutas: rutasList // Por si necesitas acceso a todas las rutas
    };
}