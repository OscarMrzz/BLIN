// Script para mostrar información del schema por consola
// Guarda esto como: scripts/show-schema.js o ejecútalo directamente en la consola de Next.js

import { getSchemaInfo, displaySchemaInfo } from '../src/services/SchemaServices';

// Opción 1: Obtener datos brutos
async function showRawSchema() {
    console.log('🔍 Obteniendo información del schema...');
    const data = await getSchemaInfo();
    console.log('Datos brutos:', JSON.stringify(data, null, 2));
}

// Opción 2: Mostrar formato legible
async function showFormattedSchema() {
    console.log('📊 Mostrando schema formateado...');
    await displaySchemaInfo();
}

// Ejecutar ambas funciones
async function main() {
    await showRawSchema();
    console.log('\n' + '='.repeat(50) + '\n');
    await showFormattedSchema();
}

// Para ejecutar: node scripts/show-schema.js
// o desde Next.js: npm run dev y luego en el navegador consola: import('./src/services/SchemaServices').then(m => m.displaySchemaInfo())

export { main, showRawSchema, showFormattedSchema };
