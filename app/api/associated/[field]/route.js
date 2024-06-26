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

        let [fields, metadata] = await connection.query(`SELECT * FROM ${params.field} LIMIT 1000`)
        
        if(!fields.length){

            let [fields, metadata] = await connection.query(`SELECT * FROM ${params.field}Type LIMIT 1000`)

        }

        return Response.json({"status":"ok",data:fields})

    } catch (error) {
            
        return Response.json({"status":"error","error":error.stack})
    }
}