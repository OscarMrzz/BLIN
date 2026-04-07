"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // Importante para el Portal
import BotonHamburguesa from "@/components/ui/Botones/BotonHamburguesa";
import UserDropdown from "./UserDropdown";
import Link from "next/link";
import GuardadoIcon from "@/Icons/GuardadoIcon";
import CashIcon from "@/Icons/CashIcon";
import MapIcon from "@/Icons/MapIcon";

export default function SidebarMovil() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Aseguramos que el portal solo se intente renderizar en el cliente
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const cerrarSidebar = () => setIsOpen(false);

  // El contenido del menú que queremos "teletransportar"
  const menuContent = (
    <div
      onClick={cerrarSidebar}
      className="fixed inset-0 h-screen w-full bg-gray-900/90 z-[9999] flex"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="overflow-y-auto pb-32 flex flex-col font-bold bg-background text-foreground h-screen w-60 py-6 animate-fade-in-right shadow-2xl"
      >
        <div className="flex justify-center items-center">
          <UserDropdown
            nombreUsuario="Jose Perez"
            apellidoUsuario="Perez Garcia"
            urlFotoPerfil={null}
            haySesion={true}
            cerrarSesion={() => {}}
            RutaMiPerfil={"/miPerfilPage"}
          />
        </div>
        <div className="flex flex-col px-4 gap-4 mt-8">
          <Link href="#" className="text-slate-300 flex items-center gap-2">
            <GuardadoIcon size={16} /> Favoritos
          </Link>
          <Link href="#" className="text-slate-300 flex items-center gap-2">
            <CashIcon size={20} /> Recargar
          </Link>
          <Link href="#" className="text-slate-300 flex items-center gap-2">
            <MapIcon size={20} /> Mapa
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      {/* El botón se queda donde está en el layout */}
      <BotonHamburguesa onClick={toggleSidebar} size={48} />

      {/* Si está abierto y montado, mandamos el menú al final del body */}
      {isOpen && mounted && createPortal(menuContent, document.body)}
    </div>
  );
}
