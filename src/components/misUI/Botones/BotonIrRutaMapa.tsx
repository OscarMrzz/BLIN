'use client'
import MapIcon from '@/Icons/MapIcon';
import React from 'react'

type Props = {
  onClick?: () => void;
  size?: number;
}

export default function BotonIrRutaMapa({ onClick, size }: Props) {
  return (
    <button onClick={onClick}>
        <MapIcon size={size} Styles='text-slate-700' />
      
    </button>
  )
}
