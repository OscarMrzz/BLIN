import React from "react";
import UserIcon from "@/Icons/UserIcon";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

type Props = {
  nombreUsuario: string;
  apellidoUsuario: string;
  urlFotoPerfil: string | null;
  haySesion: boolean;
  cerrarSesion: () => void;
  RutaMiPerfil: string;
};

export default function UserDropdown({
  nombreUsuario,
  apellidoUsuario,
  urlFotoPerfil,
  haySesion,
  cerrarSesion,
  RutaMiPerfil,
}: Props) {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const [urlFotoPerfilActual, setUrlFotoPerfilActual] = useState<string>("");

  const clickFueraMenu = (evento: MouseEvent) => {
    const target = evento.target as Node;
    if (menuRef.current?.contains(target)) return;
    if (triggerRef.current?.contains(target)) return;
    setOpenMenu(false);
  };
  const handleClickMenu = () => {
    if (!openMenu && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isLg = window.matchMedia("(min-width: 1024px)").matches;

      let left = rect.left;
      if (isLg) {
        // lg:right-5 behavior: align right edge of menu 20px from right edge of trigger
        // menu width is w-72 (18rem = 288px)
        // 20px offset
        left = rect.right - 20 - 288;
      }

      setMenuCoords({
        top: rect.bottom,
        left: left,
      });
    }
    setOpenMenu(!openMenu);
  };

  const handleClickCerrarSesion = () => {
    cerrarSesion();
    setOpenMenu(false);
  };
  const handleClickAbrirPerfil = () => {
    setOpenMenu(false);
  };

  if (!haySesion) {
    return (
      <div>
        <div className="bg-slate-500 rounded-full p-2 ">
          <UserIcon size={32} Styles="bg-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className=" relative   ">
      <div
        ref={triggerRef}
        onClick={handleClickMenu}
        className="relative overflow-hidden p-2 w-24 h-24 rounded-full bg-gray-400 flex items-center justify-center shadow-lg cursor-pointer "
      >
        {urlFotoPerfilActual ? (
          <Image
            fill
            src={urlFotoPerfilActual}
            alt="Foto de perfil"
            className="object-cover rounded-full w-12 h-12"
          />
        ) : (
          <span className="text-gray-600 text-2xl font-black w-full h-full flex justify-center items-center overflow-hidden ">
            <UserIcon size={48} Styles="text-slate-300" />
          </span>
        )}
      </div>
      {openMenu &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              top: menuCoords.top,
              left: menuCoords.left,
              position: "fixed",
              zIndex: 9999,
            }}
            className="p-4 h-90 min-h-60 w-72 bg-slate-600 rounded-xl shadow-lg"
          >
            <Link
              href={RutaMiPerfil}
              className="flex gap-2 items-center border-b border-slate-300 pb-4"
            >
              <div>
                <div className="relative overflow-hidden p-2 w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center shadow-lg cursor-pointer ">
                  {urlFotoPerfilActual ? (
                    <Image
                      fill
                      src={urlFotoPerfilActual}
                      alt="Foto de perfil"
                      className="object-cover rounded-full w-6 h-6"
                    />
                  ) : (
                    <span className="text-gray-600 text-2xl font-black w-full h-full flex justify-center items-center overflow-hidden ">
                      <UserIcon size={60} Styles="text-slate-300" />
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-light">
                  {nombreUsuario} {apellidoUsuario}
                </p>
              </div>
            </Link>
            <div className="flex flex-col gap-2 pt-4 font-light">
              <Link
                href={RutaMiPerfil}
                className="flex items-center gap-2"
                onClick={handleClickAbrirPerfil}
              >
                <UserIcon size={60} Styles="text-slate-300" />
                Perfil
              </Link>
              <p
                onClick={handleClickCerrarSesion}
                className="flex items-center gap-2 cursor-pointer"
              >
                <p>^</p>
                Cerrar sesión
              </p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
