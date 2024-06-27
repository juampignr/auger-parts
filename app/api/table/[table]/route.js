import configuration from "/appConfig.json"
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request,{ params }) {

    try {

        const connection = await mysql.createConnection({
            host: "db.auger.org.ar",
            user: "mocca",
            password: "sibyll",
            database: 'PMS',
        })

        let [fields, metadata] = await connection.query(`SELECT DISTINCT c.column_name, c.data_type,t.table_name AS associated_table FROM information_schema.columns c LEFT JOIN information_schema.tables t ON c.column_name = t.table_name WHERE c.table_name = '${params.table}'`)

        await connection.end()

        return Response.json({"status":"ok",data:fields})

    } catch (error) {
            
        return Response.json({"status":"error","error":error.stack})
    }
}