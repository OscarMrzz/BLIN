import { SaldoInterface } from "@/Interfaces/targetas.interface";
import { ClienteBrowserSupabase } from "../supabase";

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



export async function getSaldobyId(id: string) {
    const { data, error } = await ClienteBrowserSupabase.from("saldo").select("*").eq("id_saldo", id).single();

    if (error) {
        return null;
    }

    return data;
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
    const { data, error } = await ClienteBrowserSupabase.from("saldo").update({
        saldo_total: monto
    }).eq("id_targetas", idTarjeta);
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
    const { data, error } = await ClienteBrowserSupabase.from("saldo").update({
        saldo_total: monto
    }).eq("id_targetas", idTarjeta);
    if (error) {
        return null;
    }

    try {
        await registrarPago(idTarjeta, monto, "pasaje");
    } catch (error) {
        console.error("Error al registrar el pago:", error);
    }


    return data;
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
      { "column": "fecha", "type": "date", "nullable": true },
      { "column": "id_perfiles", "type": "uuid", "nullable": true },
      { "column": "metodo", "type": "character varying", "nullable": true }
    ],

*/

export async function registrarPago(idTarjeta: string, monto: number, metodo: string) {
    const { data, error } = await ClienteBrowserSupabase.from("pagos").insert({
        id_targeta: idTarjeta,
        monto: monto,
        fecha: new Date(),
        metodo: metodo
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

