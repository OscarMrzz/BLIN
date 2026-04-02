import React from "react";
import Image from "next/image";
import { CardTitle } from "@/components/ui/card";

type Props = {
  horaProximoBus: string;
  tiempoProximoAutoBus: string;
};

export default function HiroComponent({
  horaProximoBus,
  tiempoProximoAutoBus,
}: Props) {
  return (
    <section className="w-full flex flex-col gap-4 p-4">
      <div className=" lg:hidden">
        <div className="w-full h-60 flex justify-center animate-zoom-in delay-150">
          <Image
            src="/logo2/logoCompleto.png"
            alt="Logo de la aplicación"
            width={100}
            height={100}
            priority
            className="w-auto h-auto "
            style={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="text-center">
          <div className="animate-zoom-in">
            <div className="text-cyan-600">
              <p>Proximo Autobus</p>
            </div>

            <CardTitle>{horaProximoBus}</CardTitle>

            <p>{tiempoProximoAutoBus || ""}</p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="flex flex-row gap-8">
          <div className="flex gap-2">
            <span>Proximo Autobus</span>
            <span>{horaProximoBus || "..."}</span>
          </div>
          <div>
            <span>Tiempo restante</span>
            <span>{tiempoProximoAutoBus || " ..."}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
