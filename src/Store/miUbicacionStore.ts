import { create } from 'zustand';
import { StoppingInterface } from '../Interfaces/rutas.interface';

interface MiItnterface {
    miUbicacion: StoppingInterface | null;
    setMiUbicacion: (ubicacion: StoppingInterface) => void;

}

export const miUbicacionStore = create<MiItnterface>((set) => ({
    miUbicacion: null,
    setMiUbicacion: (ubicacion) => set({ miUbicacion: ubicacion }),
}));
