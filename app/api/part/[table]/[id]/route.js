import configuration from "/appConfig.json";
import mysql from "mysql2/promise";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request, { params }) {
  try {
    console.log(params);

    const table = params?.table;
    const id = params?.id;

    const connection = await mysql.createConnection({
      host: "db.auger.org.ar",
      user: "mocca",
      password: "sibyll",
      database: "PMS",
    });

    //  `SELECT DISTINCT * NOT IN ('inTime', 'UserID', 'ID')`,

    let [fields, metadata] = await connection.query(
      `select not in ('inTime', 'UserID', 'ID') from table`,
    );

    console.log(fields);

    await connection.end();

    return Response.json({ status: "ok", data: [] });
  } catch (error) {
    return Response.json({ status: "error", error: error.stack });
  }
}
