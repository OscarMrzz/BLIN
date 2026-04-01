import React from "react";
import BotonFavorito from "@/components/ui/Botones/BotonFavorito";
import BotonHome from "@/components/ui/Botones/BotonHome";
import BotonBuscar from "@/components/ui/Botones/BotonBuscar";
import BotonIrGuardados from "../ui/Botones/BotonIrAGuardados";
import HomeIcon from "@/Icons/HomeIcon";
import Link from "next/link";

export default function FooterComponet() {
  return (
    <div className="bg-slate-300 h-32 w-full shadow border-2 border-slate-100 flex lg:hidden justify-between items-center px-4 fixed   bottom-0  ">
      <BotonIrGuardados />
      <Link href={"/"}>
        <HomeIcon size={48} Styles="text-slate-700" />
      </Link>

      <BotonBuscar />
    </div>
  );
}
