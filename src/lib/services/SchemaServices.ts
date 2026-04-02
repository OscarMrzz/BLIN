import { ClienteBrowserSupabase } from "@/lib/supabase";

export async function getSchemaInfo() {
    try {
        const { data, error } = await ClienteBrowserSupabase.rpc('get_schema_info');

        if (error) {
            console.error('Error al obtener schema info:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error en getSchemaInfo:', error);
        return null;
    }
}

// Función para mostrar la información de forma legible
export async function displaySchemaInfo() {
    const schemaData = await getSchemaInfo();

    if (!schemaData) {
        console.log('No se pudo obtener la información del schema');
        return;
    }

    console.log('=== INFORMACIÓN DEL SCHEMA ===');

    if (Array.isArray(schemaData)) {
        schemaData.forEach(table => {
            console.log(`\n📋 Tabla: ${table.table_name}`);
            console.log(`   └── Columna: ${table.column_name} | Tipo: ${table.data_type} | Nullable: ${table.is_nullable}`);
        });
    } else {
        console.log('Schema Data:', schemaData);
    }

    return schemaData;
}