import React from "react";

type Props = {
  size?: number;
    Styles?: string;
};
export default function CashIcon({ size = 24, Styles }: Props) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
       
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={`icon icon-tabler icons-tabler-outline icon-tabler-cash ${Styles || ''}`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3" />
        <path d="M7 10a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8" />
        <path d="M12 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      </svg>
    </div>
  );
}
