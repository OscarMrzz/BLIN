import { point, distance } from '@turf/turf';
import { Feature, LineString } from 'geojson';

interface RutaConGeometry {
    geometry: Feature<LineString>;
    [key: string]: unknown;
}

// Función para encontrar rutas cercanas a tu posición
export function encontrarRutasCercanas(
    lng: number,
    lat: number,
    todasLasRutas: RutaConGeometry[]
) {
    // 1. Tu ubicación actual
    const userPoint = point([lng, lat]);

    // 2. Filtrar tus rutas que estén a menos de 50 metros de tu posición
    const rutasCercanas = todasLasRutas.filter((ruta: RutaConGeometry) => {
        // ruta.geometry es el LineString de la ruta del bus
        const lineString = ruta.geometry;

        // Calcular la distancia mínima desde el punto a la línea
        let minDistance = Infinity;

        if (lineString.geometry.coordinates.length >= 2) {
            for (let i = 0; i < lineString.geometry.coordinates.length - 1; i++) {
                const segmentStart = point(lineString.geometry.coordinates[i]);
                const segmentEnd = point(lineString.geometry.coordinates[i + 1]);

                // Calcular distancia del punto a cada segmento de la ruta
                const distToStart = distance(userPoint, segmentStart, 'meters');
                const distToEnd = distance(userPoint, segmentEnd, 'meters');

                minDistance = Math.min(minDistance, distToStart, distToEnd);
            }
        }

        // Considerar la ruta como cercana si está a menos de 50 metros
        return minDistance < 50;
    });

    return rutasCercanas;
}