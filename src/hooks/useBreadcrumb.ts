'use client';

import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();
  
  // Mapeo de rutas a nombres personalizados
  const routeNames: Record<string, string> = {
    '/': 'Inicio',
    '/dashboard': 'Panel',
    '/admin': 'Administración',
    '/admin/rutas': 'Gestión de Rutas',
    '/home': 'Inicio',
    '/rutas': 'Rutas',
    '/test': 'Pruebas',
    '/test-dropdown': 'Menú Desplegable',
    '/map-pag': 'Mapa',
  };

  // Dividir la ruta en segmentos
  const segments = pathname.split('/').filter(Boolean);
  
  // Construir los items del breadcrumb
  const items: BreadcrumbItem[] = [];
  
  // Siempre agregar Inicio al principio
  if (pathname !== '/') {
    items.push({
      label: 'Inicio',
      href: '/',
      isCurrent: false
    });
  }

  // Construir ruta acumulativa y agregar cada segmento
  let accumulatedPath = '';
  segments.forEach((segment, index) => {
    accumulatedPath += `/${segment}`;
    
    // Manejar rutas dinámicas (como [id])
    let label = segment;
    if (segment.startsWith('[') && segment.endsWith(']')) {
      label = 'Detalles';
    } else {
      // Buscar nombre personalizado para esta ruta
      const customName = routeNames[accumulatedPath];
      if (customName) {
        label = customName;
      } else {
        // Capitalizar primera letra
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    }
    
    const isLast = index === segments.length - 1;
    
    items.push({
      label,
      href: accumulatedPath,
      isCurrent: isLast
    });
  });

  return items;
}
