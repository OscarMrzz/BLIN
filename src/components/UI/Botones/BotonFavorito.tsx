import Favoritosicon from "@/Icons/Favoritosicon";
import React from "react";
type Props = {
  size?: number;
  onClick?: () => void;
};

export default function BotonFavorito({ size = 48, onClick }: Props) {
  return (
    <button onClick={onClick} className="cursor-pointer">
      <Favoritosicon size={size} Styles="text-slate-700" />
    </button>
  );
}
