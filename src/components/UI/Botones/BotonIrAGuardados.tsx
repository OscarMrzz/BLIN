import GuardadoIcon from "@/Icons/GuardadoIcon";

import React from "react";
type Props = {
  onClick?: () => void;
  size?: number;
};

export default function BotonIrGuardados({ onClick, size = 48 }: Props) {
  return (
    <button onClick={onClick} className="cursor-pointer">
      <GuardadoIcon size={size} Styles="text-slate-700" />
    </button>
  );
}
