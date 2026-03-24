'use client'

import GuardadoIcon from '@/Icons/GuardadoIcon';
import GuardarIcon from '@/Icons/GuardarIcon';
import React from 'react'
type Props = {
    onClick?: () => void;
    size?: number;
    estaGuardando?: boolean;
}

export default function BotonGuardarFavorito({ onClick, size = 48, estaGuardando }: Props) {

    const [guardando, setGuardando] = React.useState(estaGuardando);

    const cambiarEstadoGuardado = () => {
        setGuardando(!guardando);
    }
  return (
    <button onClick={cambiarEstadoGuardado} className='cursor-pointer'>
        {
            !guardando ? <GuardarIcon size={size} Styles='text-slate-700' /> : <GuardadoIcon size={size} Styles='text-slate-700' />
        }
        


      
    </button>
  )
}
