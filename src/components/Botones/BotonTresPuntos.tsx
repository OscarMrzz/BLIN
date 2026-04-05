import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";
import TresPuntosIncon from "@/components/icons/TresPuntosIncon";
import BasureroIcon from "@/components/icons/BasureroIcon";
import EditIcon from "@/components/icons/EditIcon";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function BotonTresPuntos({ onEdit, onDelete }: Props) {
  const [abrirMenu, setAbrirMenu] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (abrirMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      // Calculamos la posición exacta respecto al viewport + scroll
      setCoords({
        top: rect.bottom + window.scrollY - 100, // 5px de separación
        left: rect.left + window.scrollX + 10, // Ajuste para que no se salga a la derecha
      });
    }
  }, [abrirMenu]);

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (
        abrirMenu &&
        !menuRef.current?.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setAbrirMenu(false);
      }
    };
    window.addEventListener("mousedown", cerrar);
    return () => window.removeEventListener("mousedown", cerrar);
  }, [abrirMenu]);

  return (
    <>
      <button
        ref={buttonRef}
        className="cursor-pointer p-1 hover:bg-slate-100 rounded-full transition-colors"
        onClick={() => setAbrirMenu(!abrirMenu)}
      >
        <TresPuntosIncon />
      </button>

      {abrirMenu &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
            className="bg-white border border-slate-200 shadow-xl rounded-md w-36 overflow-hidden flex flex-col"
          >
            <button
              className="px-4 py-2 text-sm text-left hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2"
              onClick={() => {
                onEdit?.();
                setAbrirMenu(false);
              }}
            >
              <span>
                <EditIcon size={16} style="text-slate-500" />
              </span>
              <span className="text-slate-700">Editar</span>
            </button>
            <button
              className="px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
              onClick={() => {
                onDelete?.();
                setAbrirMenu(false);
              }}
            >
              <span>
                <BasureroIcon size={16} style="text-red-400 " />
              </span>
              <span className="text-red-400">Eliminar</span>
            </button>
          </div>,
          document.body, // Esto saca el menú del flujo del Card y lo pone en el body
        )}
    </>
  );
}
