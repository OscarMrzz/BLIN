import { SaldoInterface } from "@/Interfaces/targetas.interface";
import { ClienteBrowserSupabase } from "../supabase";
import { getUserAuth } from "./authServices";
import { getPerfilByIdUser } from "./perfilesServices";
import { getRutaById } from "./rutasServices";

/* 

    "saldo": [
      { "column": "id_saldo", "type": "uuid", "nullable": false },
      { "column": "saldo_total", "type": "bigint", "nullable": false },
      { "column": "id_targetas", "type": "uuid", "nullable": true }
    ],

*/

export async function getAllSaldos() {
    const { data, error } = await ClienteBrowserSupabase
        .from("saldo")
        .select("*");
    if (error) {
        return [];
    }





    return data as SaldoInterface[];
}



export async function getSaldobyId(id: string): Promise<SaldoInterface | null> {
    const { data, error } = await ClienteBrowserSupabase.from("saldo").select("*").eq("id_saldo", id).single();

    if (error) {
        return null;
    }

    return data as SaldoInterface;
}
export async function getSaldoForTarjeta(id: string) {
    const { data, error } = await ClienteBrowserSupabase.from("saldo").select("*").eq("id_targetas", id);

    if (error) {
        return null;
    }

    return data;
}

export async function createItemSaldo(idTarjeta: string) {
    const { data, error } = await ClienteBrowserSupabase.from("saldo").insert({
        id_targetas: idTarjeta,
        saldo_total: 0
    });
    if (error) {
        return null;
    }
    return data;
}

export async function recargarTarjeta(idTarjeta: string, monto: number) {
    // Primero obtener el saldo actual
    const { data: saldoActual, error: errorSaldo } = await ClienteBrowserSupabase
        .from("saldo")
        .select("saldo_total")
        .eq("id_targetas", idTarjeta)
        .single();

    if (errorSaldo) {
        return null;
    }

    // Sumar el monto al saldo existente
    const nuevoSaldo = (saldoActual?.saldo_total || 0) + monto;

    const { data, error } = await ClienteBrowserSupabase
        .from("saldo")
        .update({
            saldo_total: nuevoSaldo
        })
        .eq("id_targetas", idTarjeta);

    if (error) {
        return null;
    }

    try {
        await registrarRecarga(idTarjeta, monto, "recarga");
    } catch (error) {
        console.error("Error al registrar la recarga:", error);
    }

    return data;
}

export async function cobrarPasaje(idTarjeta: string, monto: number) {
    try {
        // Primero obtener el saldo actual
        const { data: saldoActual, error: errorSaldo } = await ClienteBrowserSupabase
            .from("saldo")
            .select("saldo_total")
            .eq("id_targetas", idTarjeta)
            .single();

        if (errorSaldo) {
            console.error("Error al obtener saldo actual:", errorSaldo);
            throw new Error("No se pudo obtener el saldo actual de la tarjeta");
        }

        // Validar que exista saldo
        if (!saldoActual) {
            throw new Error("No se encontró saldo para esta tarjeta");
        }

        // Validar que tenga saldo suficiente
        if (saldoActual.saldo_total < monto) {
            throw new Error("Saldo insuficiente para realizar el cobro");
        }

        // Restar el monto del saldo existente
        const nuevoSaldo = saldoActual.saldo_total - monto;

        const { data, error } = await ClienteBrowserSupabase
            .from("saldo")
            .update({
                saldo_total: nuevoSaldo
            })
            .eq("id_targetas", idTarjeta)
            .select();

        if (error) {
            console.error("Error al actualizar saldo:", error);
            throw new Error("No se pudo actualizar el saldo");
        }

        // Registrar el pago
        try {
            await registrarPago(idTarjeta, monto, "pasaje");
        } catch (error) {
            console.error("Error al registrar el pago:", error);
            // No fallar la operación si el registro del pago falla
        }

        console.log(`Pasaje cobrado exitosamente: L${monto}. Saldo anterior: L${saldoActual.saldo_total}. Nuevo saldo: L${nuevoSaldo}`);
        return data;
    } catch (error) {
        console.error("Error en cobrarPasaje:", error);
        throw error;
    }
}



/* 
    "historial_de_recargas": [
      { "column": "id_historial_de_recargas", "type": "uuid", "nullable": false },
      { "column": "id_targetas", "type": "uuid", "nullable": true },
      { "column": "monto", "type": "bigint", "nullable": true },
      { "column": "fecha", "type": "date", "nullable": true },
      { "column": "metodo", "type": "character varying", "nullable": true }
    ],

*/

export async function registrarRecarga(idTarjeta: string, monto: number, metodo: string) {
    const { data, error } = await ClienteBrowserSupabase.from("historial_de_recargas").insert({
        id_targetas: idTarjeta,
        monto: monto,
        fecha: new Date(),
        metodo: metodo
    });
    if (error) {
        return null;
    }
    return data;
}


export async function getHistorialRecargas(idTarjeta: string) {
    const { data, error } = await ClienteBrowserSupabase.from("historial_de_recargas").select("*").eq("id_targetas", idTarjeta);
    if (error) {
        return null;
    }
    return data;
}


/* 
    "pagos": [
      { "column": "id_pagos", "type": "uuid", "nullable": false },
      { "column": "id_targeta", "type": "uuid", "nullable": false },
      { "column": "monto", "type": "bigint", "nullable": true },
      { "column": "metodo", "type": "character varying", "nullable": true },
      { "column": "fecha", "type": "date", "nullable": true },
      { "column": "id_cobrador", "type": "uuid", "nullable": true },
      { "column": "id_rutas", "type": "uuid", "nullable": true }
    ],

*/

export async function registrarPago(idTarjeta: string, monto: number, metodo: string) {
    // Obtener el usuario autenticado
    const usuarioLogiado = await getUserAuth();

    if (!usuarioLogiado || !usuarioLogiado.id) {
        throw new Error("Usuario no autenticado o sin ID válido");
    }

    // Obtener el perfil del cobrador
    const perfilDeCobrador = await getPerfilByIdUser(usuarioLogiado.id);

    if (!perfilDeCobrador) {
        throw new Error("No se encontró el perfil del cobrador");
    }

    const { data, error } = await ClienteBrowserSupabase.from("pagos").insert({
        id_targeta: idTarjeta,
        monto: monto,
        fecha: new Date(),
        metodo: metodo,
        id_cobrador: usuarioLogiado.id,
        id_rutas: perfilDeCobrador.id_rutas
    });
    if (error) {
        return null;
    }
    return data;
}


export async function getHistorialPagos(idTarjeta: string) {
    const { data, error } = await ClienteBrowserSupabase.from("pagos").select("*").eq("id_targeta", idTarjeta);
    if (error) {
        return null;
    }
    return data;
}

export async function getMontoACobrarSegunRuta() {
    try {
        // Validar que el usuario esté autenticado
        const usuarioLogiado = await getUserAuth();

        if (!usuarioLogiado || !usuarioLogiado.id) {
            throw new Error("Usuario no autenticado o sin ID válido");
        }

        const idUsuarioLogiado = usuarioLogiado.id;

        // Obtener perfil del cobrador
        const perfilDeCobrador = await getPerfilByIdUser(idUsuarioLogiado);

        if (!perfilDeCobrador) {
            throw new Error("No se encontró el perfil del cobrador");
        }

        if (!perfilDeCobrador.id_rutas) {
            throw new Error("El cobrador no tiene una ruta asignada");
        }

        const idRuta = perfilDeCobrador.id_rutas;

        // Obtener información de la ruta
        const ruta = await getRutaById(idRuta);

        if (!ruta) {
            throw new Error("No se encontró la ruta asignada");
        }

        // Validar que el monto a cobrar exista y sea un número válido
        // Usar precio como fallback si monto_a_cobrar no está configurado
        let montoACobrar = ruta.monto_a_cobrar;

        if (montoACobrar === undefined || montoACobrar === null) {
            montoACobrar = ruta.precio;
        }

        if (montoACobrar === undefined || montoACobrar === null) {
            throw new Error("La ruta no tiene un monto a cobrar configurado");
        }

        if (typeof montoACobrar !== 'number' || isNaN(montoACobrar)) {
            throw new Error("El monto a cobrar no es un número válido");
        }

        if (montoACobrar < 0) {
            throw new Error("El monto a cobrar no puede ser negativo");
        }

        return montoACobrar;

    } catch (error) {
        console.error("Error al obtener monto a cobrar según ruta:", error);

        // Lanzar el error para que el componente que lo use pueda manejarlo
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error("Error desconocido al obtener monto a cobrar");
        }
    }
}
