import { create } from 'zustand';
import { ParadaBusInterface } from '../Interfaces/rutas.iterface';

interface MiItnterface {
    miUbicacion: ParadaBusInterface | null;
    setMiUbicacion: (ubicacion: ParadaBusInterface) => void;
 
}

export const miUbicacionStore = create<MiItnterface>((set) => ({
    miUbicacion: null,
    setMiUbicacion: (ubicacion) => set({ miUbicacion: ubicacion }),
}));
 