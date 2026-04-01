"use client";
import { rutaInterface } from "@/Interfaces/rutas.iterface";
import BotonGuardar from "../ui/Botones/BotonGuardar";
import BotonGuardarFavorito from "../ui/Botones/BotonGuardar";
import BotonIrRutaMapa from "../ui/Botones/BotonIrRutaMapa";
import Link from "next/link";
import MapIcon from "@/Icons/MapIcon";
type Props = {
  ruta: rutaInterface;
};

export default function RutaItem({ ruta }: Props) {
  return (
    <div className=" p-4 w-full h-24 min-h-32 bg-white shadow rounded-2xl  font-bold text-slate-700  flex justify-between">
      <div>
        <h2>{ruta.nombre}</h2>
        <img src="/img/busFino.png" className="w-18 " alt="" />
      </div>

      <div className="font-light flex flex-col justify-between ">
        <div className="flex gap-4">
          <div className="flex justify-center items-center  font-thin text-slate-700">
            L 37:00
          </div>
          <div>12:45 PM</div>
        </div>

        <div className="flex justify-end gap-8">
          <Link href={`rutas/${ruta.id_rutas}`}>
            <MapIcon size={32} />
          </Link>
          <Link href={`map-pag/${ruta.id_rutas}`}>
            <MapIcon size={32} />
          </Link>
          <BotonGuardarFavorito size={32} estaGuardando={false} />
        </div>
      </div>
    </div>
  );
}
