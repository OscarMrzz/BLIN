import L from "leaflet";
import "leaflet-routing-machine";

import {
  formatRoutingError,
  RUTA_MAP_LOG_PREFIX,
  type FormattedRoutingError,
} from "./formatRoutingError";

export type OsrmBackendLabel = "primario" | "reserva" | "backup" | "demo";

export type OsrmEndpointConfig = {
  label: OsrmBackendLabel;
  serviceUrl: string;
};

const DEMO_OSRM = "https://router.project-osrm.org/route/v1";

/** Usa log (no info): en Edge/Chrome el nivel "Info" suele estar oculto y no verías los motores OSRM. */
function osrmConsole(...args: unknown[]) {
  console.log(RUTA_MAP_LOG_PREFIX, ...args);
}

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function isValidHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Orden: primario (env), reserva (env opcional), demo público.
 * Se eliminan duplicados y URLs inválidas.
 */
export function buildOsrmEndpointList(): OsrmEndpointConfig[] {
  const primary = process.env.NEXT_PUBLIC_OSRM_URL?.trim();
  const secondary = process.env.NEXT_PUBLIC_OSRM_FALLBACK_URL?.trim();

  const candidates: { label: OsrmBackendLabel; serviceUrl: string | undefined }[] = [
    { label: "primario", serviceUrl: primary || undefined },
    { label: "reserva", serviceUrl: secondary || undefined },
    { label: "backup", serviceUrl: "https://routing.openstreetmap.de/routed-car/route/v1" },
    { label: "demo", serviceUrl: DEMO_OSRM },
  ];

  const seen = new Set<string>();
  const out: OsrmEndpointConfig[] = [];

  for (const c of candidates) {
    if (!c.serviceUrl || !isValidHttpUrl(c.serviceUrl)) continue;
    const key = normalizeUrl(c.serviceUrl).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ label: c.label, serviceUrl: normalizeUrl(c.serviceUrl) });
  }

  return out;
}

function isDemoHost(serviceUrl: string): boolean {
  return serviceUrl.includes("router.project-osrm.org");
}

type OsrmRouterEntry = {
  label: OsrmBackendLabel;
  serviceUrl: string;
  instance: L.Routing.OSRMv1;
};

function createOsrmInstances(
  endpoints: OsrmEndpointConfig[],
): OsrmRouterEntry[] {
  return endpoints.map((ep) => ({
    label: ep.label,
    serviceUrl: ep.serviceUrl,
    instance: L.Routing.osrmv1({
      serviceUrl: ep.serviceUrl,
      useHints: false,
      timeout: 8000,
      suppressDemoServerWarning:
        ep.label === "demo" || isDemoHost(ep.serviceUrl),
      language: "es",
    }),
  }));
}

function logMotorBanner(
  motor: number,
  total: number,
  ep: OsrmEndpointConfig,
  phase: "start" | "ok" | "fail",
) {
  const tag = `[${motor}/${total}]`;
  if (phase === "start") {
    osrmConsole(
      `▶ Motor OSRM ${tag} · ${ep.label} — ejecutando solicitud de ruta…`,
    );
    osrmConsole(`   Endpoint base: ${ep.serviceUrl}`);
    return;
  }
  if (phase === "ok") {
    osrmConsole(
      `✓ Motor OSRM ${tag} · ${ep.label} — éxito; ruta recibida (este motor es el que está usando el mapa).`,
    );
    return;
  }
  osrmConsole(
    `✗ Motor OSRM ${tag} · ${ep.label} — falló la solicitud.`,
  );
}

function logMotorFailureDetails(
  formatted: FormattedRoutingError,
  motor: number,
  total: number,
) {
  osrmConsole(`   Diagnóstico (${motor}/${total}): ${formatted.tipoFallo}`);
  osrmConsole(`   Resumen técnico: ${formatted.mensajeTecnico}`);
  if (formatted.url) {
    osrmConsole(`   URL de petición: ${formatted.url}`);
  }
  osrmConsole(`   Posibles causas y qué hacer (en orden):`);
  formatted.sugerencias.forEach((paso, i) => {
    osrmConsole(`     ${i + 1}. ${paso}`);
  });
}

function mergeFinalError(
  lastFormatted: FormattedRoutingError,
  endpoints: OsrmEndpointConfig[],
): L.Routing.IError {
  const labels = endpoints.map((e) => e.label).join(", ");
  return {
    status: lastFormatted.codigo,
    message: [
      `Ningún motor OSRM respondió correctamente (intentados: ${labels}).`,
      `Último fallo: ${lastFormatted.tipoFallo} — ${lastFormatted.mensajeTecnico}`,
      lastFormatted.sugerencias.slice(0, 2).join(" "),
    ].join(" "),
  };
}

/**
 * Router compatible con L.Routing.control: intenta cada OSRM en orden hasta éxito.
 */
export function createOsrmFallbackRouter(
  endpoints: OsrmEndpointConfig[],
): L.Routing.IRouter {
  const routers = createOsrmInstances(endpoints);
  const last = routers[routers.length - 1]?.instance;
  const total = endpoints.length;

  return {
    route(waypoints, callback, context, options) {
      let index = 0;

      osrmConsole(
        `━━━ Inicio secuencia OSRM ━━━ ${total} motor(es) · Orden: ${endpoints.map((e) => e.label).join(" → ")} · Waypoints: ${waypoints.length}`,
      );

      const tryNext = (err?: unknown, routes?: L.Routing.IRoute[]) => {
        const ok = !err && routes && routes.length > 0;
        const motor = index + 1;
        const ep = endpoints[index];

        if (ok) {
          logMotorBanner(motor, total, ep, "ok");
          return callback.call(context ?? callback, undefined, routes);
        }

        const formatted = formatRoutingError(err, {
          backendLabel: ep?.label,
          serviceUrl: ep?.serviceUrl,
        });
        logMotorBanner(motor, total, ep, "fail");
        logMotorFailureDetails(formatted, motor, total);

        if (index >= routers.length - 1) {
          osrmConsole(
            `Secuencia terminada: ✗ todos los motores fallaron; se muestra error en el mapa.`,
          );
          return callback.call(
            context ?? callback,
            mergeFinalError(formatted, endpoints),
          );
        }

        index += 1;
        const next = endpoints[index];
        const nextMotor = index + 1;
        osrmConsole(
          `⏭ Pasando al siguiente motor [${nextMotor}/${total}] · ${next.label}`,
        );

        logMotorBanner(nextMotor, total, next, "start");
        routers[index].instance.route(waypoints, tryNext, context, options);
      };

      const first = endpoints[0];
      logMotorBanner(1, total, first, "start");
      routers[0].instance.route(waypoints, tryNext, context, options);
    },

    requiresMoreDetail(
      route: Parameters<L.Routing.OSRMv1["requiresMoreDetail"]>[0],
      zoom: Parameters<L.Routing.OSRMv1["requiresMoreDetail"]>[1],
      bounds: Parameters<L.Routing.OSRMv1["requiresMoreDetail"]>[2],
    ) {
      if (!last?.requiresMoreDetail) return false;
      return last.requiresMoreDetail(route, zoom, bounds);
    },
  } as L.Routing.IRouter;
}
