/**
 * Normaliza errores de leaflet-routing-machine / OSRM v5 y genera diagnósticos accionables.
 */

export const RUTA_MAP_LOG_PREFIX = "[RutaMap]";

export type RoutingErrorLike = {
  status?: string | number;
  message?: string;
  url?: string;
  target?: {
    status?: number;
    statusText?: string;
    responseText?: string;
  };
};

export type FormattedRoutingError = {
  codigo: string;
  mensajeTecnico: string;
  url?: string;
  /** Pasos concretos para resolver el fallo (ordenados). */
  sugerencias: string[];
  resumenUsuario: string;
  /** Etiqueta breve del tipo de fallo (para consola). */
  tipoFallo: string;
};

export type RoutingErrorContext = {
  backendLabel?: string;
  serviceUrl?: string;
};

function asErrorLike(err: unknown): RoutingErrorLike {
  if (err !== null && typeof err === "object") {
    return err as RoutingErrorLike;
  }
  return {};
}

function parseUrlSafe(raw?: string): { hostname: string; port: string; display: string } | null {
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const port =
      u.port ||
      (u.protocol === "https:" ? "443 (implícito TLS)" : "80 (implícito HTTP)");
    return { hostname: u.hostname, port: u.port || port, display: `${u.host}` };
  } catch {
    return null;
  }
}

/**
 * Clasifica el error y devuelve un resumen + pasos profesionales para consola/UI.
 */
export function analyzeRoutingFailure(
  err: unknown,
  ctx?: RoutingErrorContext,
): {
  tipoFallo: string;
  resumenLinea: string;
  pasos: string[];
} {
  const e = asErrorLike(err);
  const rawMsg = typeof e.message === "string" ? e.message : "";
  const msg = rawMsg.toLowerCase();
  const urlCombined = e.url || ctx?.serviceUrl || "";

  if (rawMsg.includes("Ningún motor OSRM respondió correctamente")) {
    return {
      tipoFallo: "Secuencia completada: todos los motores fallaron",
      resumenLinea:
        "Ningún endpoint OSRM devolvió una ruta. Revisa los bloques ✗ anteriores en consola (cada uno tiene causas ordenadas).",
      pasos: [
        "Arriba en esta misma consola deberías ver un ✗ por cada motor (primario / reserva / demo) con su diagnóstico específico.",
        "El fallo más habitual en localhost es puerto sin servicio: Docker apagado, contenedor caído o `NEXT_PUBLIC_OSRM_URL` apuntando a un puerto distinto al publicado.",
        "Si solo falla el primario y el demo funciona, el problema está en tu despliegue local o CORS del OSRM propio, no en Leaflet.",
        "Tras corregir el backend, recarga la página y comprueba que el primer motor muestre ✓.",
      ],
    };
  }
  const hostInfo = parseUrlSafe(urlCombined) ?? parseUrlSafe(e.url ?? undefined);
  const httpFromTarget =
    typeof e.target?.status === "number" ? e.target.status : undefined;
  const st = e.status;
  const stStr = st !== undefined && st !== "" ? String(st) : "";

  // —— Respuestas OSRM con código de negocio (no hay ruta, etc.)
  if (stStr === "NoRoute" || stStr === "NoPath") {
    return {
      tipoFallo: "OSRM: sin ruta en el grafo",
      resumenLinea:
        "El motor respondió, pero no existe ruta entre los puntos en este mapa vial.",
      pasos: [
        "Confirma que las paradas están sobre calles incluidas en el extract (.osm) con el que se generó OSRM.",
        "Si el servidor es regional: verifica que el polígono del extract cubra todas las coordenadas.",
        "Prueba acercando un punto a una vía conocida; coordenadas en campo abierto suelen dar NoRoute.",
        "Si en demo funciona pero en tu servidor no, recompila el extract o el perfil (driving/foot) adecuado.",
      ],
    };
  }
  if (stStr === "NoSegment") {
    return {
      tipoFallo: "OSRM: punto fuera de la red",
      resumenLinea:
        "Al menos un waypoint no se puede proyectar a un segmento del grafo (demasiado lejos de la vía).",
      pasos: [
        "Corrige coordenadas para que caigan sobre la calle (no en el centro de manzanas sin vía).",
        "Revisa el CRS (WGS84 lat/lon); intercambiar lat/lon produce este error con frecuencia.",
        "Amplía el extract OSRM si las paradas están en zona no descargada del mapa.",
      ],
    };
  }

  // —— Timeout explícito del cliente OSRM en LRM
  if (msg.includes("timed out") || msg.includes("timeout")) {
    return {
      tipoFallo: "Tiempo de espera agotado",
      resumenLinea:
        "El navegador canceló la petición: el servidor no respondió dentro del timeout configurado.",
      pasos: [
        "Comprueba carga del host OSRM (CPU/RAM) y tamaño del request; rutas muy largas tardan más.",
        "Si es un contenedor, mira logs: `docker logs <contenedor_osrm>`.",
        "Aumenta el timeout en el código (opción `timeout` de `L.Routing.osrmv1`) si el backend es lento pero sano.",
        "Regla un proxy inverso (nginx) sin lecturas bloqueantes que retengan la respuesta.",
      ],
    };
  }

  // —— JSON / respuesta no OSRM
  if (
    st === -2 ||
    st === -3 ||
    msg.includes("parsing osrm") ||
    msg.includes("error parsing") ||
    msg.includes("parse")
  ) {
    return {
      tipoFallo: "Respuesta no válida (no es OSRM v5)",
      resumenLinea:
        "La URL devolvió cuerpo que no se pudo interpretar como JSON de la API Route v1.",
      pasos: [
        "Verifica que la base sea exactamente la de OSRM v5, terminando en `/route/v1` (sin rutas de otro servicio).",
        "Abre la misma URL en el navegador o con curl y confirma que ves JSON con `code` y `routes`.",
        "Si hay un reverse proxy, asegúrate de que no devuelva HTML de error (404/502) en lugar del backend.",
      ],
    };
  }

  const configInvalid =
    stStr === "InvalidUrl" ||
    msg.includes("undefined/") ||
    msg.includes("invalid url");
  if (configInvalid) {
    return {
      tipoFallo: "Configuración: URL inválida",
      resumenLinea:
        "La URL del motor no es utilizable (falta variable de entorno o está mal formada).",
      pasos: [
        "Define `NEXT_PUBLIC_OSRM_URL` como URL absoluta, p. ej. `http://127.0.0.1:5000/route/v1`.",
        "Tras cambiar `.env.local`, reinicia `next dev` / reconstruye para inyectar variables `NEXT_PUBLIC_*`.",
      ],
    };
  }

  // —— Errores HTTP con código (4xx/5xx visibles)
  const httpInMessage = rawMsg.match(/\bHTTP\s+(\d{3})\b/i);
  const code =
    httpInMessage?.[1] != null
      ? parseInt(httpInMessage[1], 10)
      : httpFromTarget && httpFromTarget > 0
        ? httpFromTarget
        : null;

  if (code === 401 || code === 403) {
    return {
      tipoFallo: `HTTP ${code} · No autorizado`,
      resumenLinea: "El servidor rechazó la petición por autenticación o permisos.",
      pasos: [
        "Si el OSRM va detrás de un API gateway, revisa tokens, API keys o IP allowlist.",
        "Confirma que las peticiones GET a `/route/v1/...` están permitidas para tu origen.",
      ],
    };
  }
  if (code === 404) {
    return {
      tipoFallo: "HTTP 404 · Ruta de API incorrecta",
      resumenLinea:
        "El host respondió pero no existe el recurso (mal path o versión de API).",
      pasos: [
        "La base debe incluir `/route/v1`; no pongas el perfil (`driving`) en la URL base.",
        "Comprueba documentación del despliegue: algunos stacks exponen otro prefijo.",
      ],
    };
  }
  if (code !== null && code >= 500) {
    return {
      tipoFallo: `HTTP ${code} · Error del servidor`,
      resumenLinea: "El motor OSRM o un proxy devolvió error interno.",
      pasos: [
        "Revisa logs del contenedor o del proceso `osrm-routed`.",
        "Valida que los archivos `.osrm` del extract estén montados y no corruptos.",
        "Si hay balanceador, inspecciona health checks y tiempos de espera.",
      ],
    };
  }

  // —— Fallo de red / CORS / conexión (muy frecuente en localhost)
  const looksNetwork =
    msg.includes("http request failed") ||
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("load failed") ||
    msg.includes("connection refused") ||
    msg.includes("err_connection") ||
    (httpFromTarget === 0 && !httpInMessage);

  if (looksNetwork) {
    const loc =
      hostInfo &&
      (hostInfo.hostname === "localhost" ||
        hostInfo.hostname === "127.0.0.1" ||
        hostInfo.hostname === "::1");

    if (loc && hostInfo) {
      const portHint = hostInfo.port || "el puerto configurado en la URL";
      return {
        tipoFallo: "Red local: servicio no alcanzable",
        resumenLinea: `No se pudo conectar a ${hostInfo.display}. Suele ser puerto cerrado o proceso no iniciado (p. ej. conexión rechazada).`,
        pasos: [
          `Comprueba que hay un proceso escuchando en ${hostInfo.display} (mismo host donde corre el navegador). En Windows: netstat -ano | findstr :<PUERTO>; desde terminal prueba curl o Invoke-WebRequest contra ${urlCombined || ctx?.serviceUrl || "la URL base de OSRM"}.`,
          "Si usas Docker: `docker compose ps` o `docker ps` y confirma que el contenedor OSRM está **Up** y el mapeo de puertos coincide (ej. `5000:5000`).",
          "Si el motor no está levantado, arranca el stack (compose up / script del proyecto) antes de abrir el mapa.",
          "Si el proceso está en otra máquina o VM, sustituye `localhost` por la IP/hostname correcto en `NEXT_PUBLIC_OSRM_URL`.",
          "Si el servicio **sí** escucha pero el fallo persiste, entonces revisa **CORS**: el backend debe enviar `Access-Control-Allow-Origin` incluyendo `http://localhost:3000` (u tu origen).",
        ],
      };
    }

    return {
      tipoFallo: "Red: sin respuesta del servidor remoto",
      resumenLinea: hostInfo
        ? `No hubo respuesta HTTP válida al contactar ${hostInfo.display}.`
        : "No hubo respuesta HTTP válida del motor configurado.",
      pasos: [
        "Verifica VPN, firewall corporativo y que el host sea alcanzable (`ping` / `curl` desde tu red).",
        "Confirma DNS y que la URL no apunte a un entorno apagado.",
        "Si es HTTPS, revisa certificado caducado o TLS intermedio bloqueado.",
        "Abre DevTools → pestaña **Red**, selecciona la petición fallida: verás el código exacto (CORS vs red vs 502).",
      ],
    };
  }

  // —— CORS explícito en mensaje
  if (msg.includes("cors")) {
    return {
      tipoFallo: "CORS bloqueado",
      resumenLinea:
        "El navegador bloqueó la respuesta porque faltan cabeceras CORS adecuadas.",
      pasos: [
        "Configura el backend OSRM o nginx delante con `Access-Control-Allow-Origin` para tu origen (dev: `http://localhost:3000`).",
        "En desarrollo alternativo: proxy la API vía Next.js `rewrites` para mismo origen y evitar CORS.",
      ],
    };
  }

  return {
    tipoFallo: "Fallo no clasificado",
    resumenLinea: rawMsg || `Código/estado: ${stStr || "sin detalle"}`,
    pasos: [
      "Abre DevTools → **Consola** y **Red**, reproduce el error y anota el estado HTTP o el texto `net::…`.",
      "Comprueba `NEXT_PUBLIC_OSRM_URL` y `NEXT_PUBLIC_OSRM_FALLBACK_URL` y reinicia el servidor de Next tras cambios.",
      "Compara el mismo request con `curl` desde terminal; si curl OK pero el navegador falla, sospecha CORS.",
    ],
  };
}

export function formatRoutingError(
  err: unknown,
  context?: RoutingErrorContext,
): FormattedRoutingError {
  const e = asErrorLike(err);
  const status = e.status;
  const message = typeof e.message === "string" ? e.message : "";
  const url = typeof e.url === "string" ? e.url : undefined;
  const target = e.target;

  let httpDetail = "";
  if (target && typeof target.status === "number") {
    httpDetail = `HTTP ${target.status}${target.statusText ? ` ${target.statusText}` : ""}`;
  }

  const codigo =
    status !== undefined && status !== ""
      ? String(status)
      : httpDetail
        ? httpDetail
        : "desconocido";

  let mensajeTecnico = message;
  if (httpDetail && !mensajeTecnico.toLowerCase().includes("http")) {
    mensajeTecnico = mensajeTecnico
      ? `${mensajeTecnico} — ${httpDetail}`
      : httpDetail;
  }
  if (!mensajeTecnico && typeof status === "string") {
    mensajeTecnico = `Código OSRM: ${status}`;
  }
  if (!mensajeTecnico) {
    mensajeTecnico =
      "Respuesta de error sin mensaje descriptivo del cliente OSRM.";
  }

  const analysis = analyzeRoutingFailure(err, {
    ...context,
    serviceUrl: context?.serviceUrl ?? url,
  });
  const backend = context?.backendLabel
    ? ` [${context.backendLabel}]`
    : "";
  const resumenUsuario = `${backend} ${analysis.tipoFallo} — ${analysis.resumenLinea}`;

  return {
    codigo,
    mensajeTecnico,
    url,
    sugerencias: analysis.pasos,
    resumenUsuario,
    tipoFallo: analysis.tipoFallo,
  };
}

export function formatRoutingErrorLogBlock(
  err: unknown,
  context?: RoutingErrorContext,
): string {
  const f = formatRoutingError(err, context);
  const lines = [
    `${RUTA_MAP_LOG_PREFIX} Error de enrutado — ${f.tipoFallo}`,
    `  ${f.resumenUsuario}`,
    ...f.sugerencias.map((h, i) => `  ${i + 1}. ${h}`),
  ];
  if (f.url) lines.push(`  URL: ${f.url}`);
  return lines.join("\n");
}
