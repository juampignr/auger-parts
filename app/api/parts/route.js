import configuration from "/appConfig.json"
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic' // defaults to auto

export async function GET(request,response) {

    try {
        
        const connection = await mysql.createConnection({
            host: "db.auger.org.ar",
            user: "mocca",
            password: "sibyll",
            database: 'PMS',
        })
    
        let [parts, metadata] = await connection.query('select distinct Name from sysTables where Type = "unique"')
    
        parts = parts.map((element)=>{
    
            return element.Name
        })
        
        await connection.end()

        return Response.json({"status":"ok","data":parts})

    } catch (error) {
        
        return Response.json({"status":"error","error":error.stack})
    }
    
}