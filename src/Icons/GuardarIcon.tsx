import React from "react";
type Props = {
  size?: number;
  Styles?: string;
};
export default function GuardarIcon({ size=24, Styles }: Props) {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size }
        height={size }
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`icon icon-tabler icons-tabler-outline icon-tabler-bookmark ${Styles || ''}`}
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4" />
      </svg>
    </div>
  );
}
