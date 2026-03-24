import React from "react";
type Props = {
  size?: number;
  Styles?: string;
};

export default function BuscarSimpleIcon({ size = 24, Styles }: Props) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`icon icon-tabler icons-tabler-outline icon-tabler-search ${Styles || ""}`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
      </svg>
    </div>
  );
}
