"use client"
import { roleInterface } from '@/Interfaces/rolesInterface';
import React from 'react'
import { getRoles } from '@/services/rolesServices';

export default function Page() {
    const [roles, setRoles] = React.useState<roleInterface[]>([]);
    React.useEffect(() => {
     const loadRoles = async () => {
       const roles:roleInterface[] = await getRoles() || [];
       setRoles(roles);
     };
     loadRoles();
    }, []);
  return (
    <div>
        <h2>Roles</h2>
        <div className="flex flex-col gap-4">

 
        {roles.map((role) => (
            <div key={role.id_rol} className=" flex gap-4 bg-blue-300 h-24 w-full shadow">
                <h3 className="text-2xl font-bold text-blue-950">{role.nombre}</h3>
                <p>{role.estado}</p>
            </div>
        ))}
        </div>
    </div>
  )
}
