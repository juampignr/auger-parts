import configuration from "/appConfig.json"
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request,response) {

    const connection = await mysql.createConnection({
        host: "db.auger.org.ar",
        user: "mocca",
        password: "sibyll",
        database: 'PMS',
    })

    let [parts, metadata] = await connection.query('select Name from sysTables where Type = "unique"')

    parts = parts.map((element)=>{

        return element.Name
    })
    
    return Response.json({"status":"ok","data":parts})
}