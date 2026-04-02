import React from "react";

type Props = {
  size?: number;
  color?: string;
};

export default function TresPuntosIncon({
  size = 24,
  color = "text-slate-700",
}: Props) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`icon icon-tabler icons-tabler-outline icon-tabler-dots-vertical ${color}`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
    </div>
  );
}
