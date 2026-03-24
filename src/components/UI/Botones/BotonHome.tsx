import HomeIcon from "@/Icons/HomeIcon";
import React from "react";
type Props = {
  onClick?: () => void;
  size?: number;
};

export default function BotonHome({ onClick, size = 48 }: Props) {
  return (
    <button onClick={onClick} className="cursor-pointer">
      <HomeIcon size={size} Styles="text-slate-700" />
    </button>
  );
}
