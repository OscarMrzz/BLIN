import React from "react";
import Image from "next/image";
import { CardTitle } from "@/components/misUI/card";

type Props = {
  horaProximoBus: string;
  tiempoProximoAutoBus: string;
};

export default function HiroComponent({
  horaProximoBus,
  tiempoProximoAutoBus,
}: Props) {
  return (
    <section className="w-full flex flex-col gap-6 p-6 bg-linear-to-br ">
      {/* Versión móvil */}
      <div className="lg:hidden">
        <div className="relative w-full h-48 flex justify-center items-center mb-8">
          <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-20 "></div>
          <Image
            src="/logo2/logoCompleto.png"
            alt="Logo de la aplicación"
            width={120}
            height={120}
            priority
            className="relative z-10 w-auto h-auto drop-shadow-2xl"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        <div className="text-center space-y-6">
          <div className="relative inline-block animate-zoom-in">
           
         
              <div className="text-orange-600 font-semibold text-sm uppercase tracking-wider mb-2">
                Próximo Autobús
              </div>
              <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-orange-400 mb-3">
                {horaProximoBus}
              </CardTitle>
              <div className="text-lg text-slate-600 font-medium">
                {tiempoProximoAutoBus || "Calculando..."}
              </div>
       
          </div>
        </div>
      </div>

      {/* Versión desktop */}
      <div className="hidden lg:block">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                  Prómino Autobús
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {horaProximoBus || "..."}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-slate-600 font-medium">Tiempo restante:</div>
              <div className="bg-linear-to-r from-orange-100 to-orange-200 text-orange-700 px-4 py-2 rounded-xl font-semibold text-lg">
                {tiempoProximoAutoBus || "Calculando..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
