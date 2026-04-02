import React from "react";
import BotonHamburguesa from "@/components/ui/Botones/BotonHamburguesa";
import BotonBuscar from "@/components/ui/Botones/BotonBuscar";
import BotonHome from "@/components/ui/Botones/BotonHome";
import BotonFavorito from "@/components/ui/Botones/BotonFavorito";
import UserIcon from "@/Icons/UserIcon";
import SidebarMovil from "../Sidebar/SidebarMovil";
import Image from "next/image";
import Link from "next/link";

export default function HeaderComponent() {
  return (
    <div className=" felx w-full h-16 p-4 flex justify-between fixed   top-0 z-50 bg-background text-foreground ">
      <Link href="/">
        <Image
          src="/logo2/logoLetras.png"
          alt="Logo de la aplicación"
          width={100}
          height={100}
          priority
          className="w-auto h-auto" // Fuerza a mantener el aspect ratio si hay estilos externos
          style={{ width: "auto", height: "auto" }} // Refuerzo para eliminar la advertencia de Next.js
        />
      </Link>
      <div>
        <div className="hidden  lg:flex gap-4">
          <BotonFavorito size={32} />
          <BotonHome size={32} />
          <div className=" rounded-full h-12 w-12 flex justify-center items-center">
            <UserIcon size={32} Styles="text-slate-700" />
          </div>
        </div>
        <div className="flex lg:hidden ">
          <SidebarMovil />
        </div>
      </div>
    </div>
  );
}
