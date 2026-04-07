import React from "react";
import HamburguesaIcon from "../../../Icons/HamburguesaIcons";
type Props = {
  onClick?: () => void;
  size?: number;
};

export default function BotonHamburguesa({ onClick, size = 48 }: Props) {
  return (
    <button onClick={onClick} className="cursor-pointer">
      <HamburguesaIcon size={size} Styles="text-foreground" />
    </button>
  );
}
