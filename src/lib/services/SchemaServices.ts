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

// Función para obtener la información del schema en formato JSON
export async function getSchemaInfoJSON() {
    const schemaData = await getSchemaInfo();

    if (!schemaData) {
        return {
            success: false,
            error: 'No se pudo obtener la información del schema',
            data: null
        };
    }

    // Formatear los datos en una estructura JSON más organizada
    const formattedData: Record<string, {
        table_name: string;
        columns: Array<{
            column_name: string;
            data_type: string;
            is_nullable: string;
        }>;
    }> = {};

    if (Array.isArray(schemaData)) {
        // Agrupar por tabla
        schemaData.forEach(table => {
            const tableName = table.table_name;

            if (!formattedData[tableName]) {
                formattedData[tableName] = {
                    table_name: tableName,
                    columns: []
                };
            }

            formattedData[tableName].columns.push({
                column_name: table.column_name,
                data_type: table.data_type,
                is_nullable: table.is_nullable
            });
        });
    }

    return {
        success: true,
        data: formattedData,
        raw_data: schemaData
    };
}

// Función para mostrar la información de forma legible (mantener para compatibilidad)
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
