// Script para probar las rutas protegidas
const protectedRoutes = [
  '/admin',
  '/admin/bus',
  '/cobrador',
  '/cobrador/lectura',
  '/agente',
  '/dashboard',
  '/reportes',
  '/perfil',
  '/sistema',
  '/recarga',
  '/rutas/123',
  '/rutas/test'
];

const publicRoutes = [
  '/',
  '/home',
  '/rutas',
  '/map-pag/123'
];

console.log('🔒 Rutas Protegidas (deberían redirigir a / si no estás autenticado):');
protectedRoutes.forEach(route => {
  console.log(`  - ${route}`);
});

console.log('\n🌐 Rutas Públicas (acceso sin autenticación):');
publicRoutes.forEach(route => {
  console.log(`  - ${route}`);
});

console.log('\n📋 Instrucciones de prueba:');
console.log('1. Abre el navegador en http://localhost:3000');
console.log('2. Intenta acceder a las rutas protegidas sin estar autenticado');
console.log('3. Deberías ser redirigido automáticamente a la página principal (/)');
console.log('4. Inicia sesión y prueba acceder a las rutas según tu rol');
