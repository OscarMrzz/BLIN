import React from "react";

type Props = {
  size?: number;
  Styles?: string;
};

export default function MarcadorMapa({ size = 24, Styles }: Props) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`icon icon-tabler icons-tabler-filled icon-tabler-map-pin ${Styles || ''}`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
      </svg>
    </div>
  );
}
