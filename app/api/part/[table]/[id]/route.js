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

    let includedFields = "";
    let [fields, metadata] = await connection.query(
      `show columns from ${table}`,
    );

    for (const fieldName in fields) {
      if (!["inTime", "UserID", "ID"].contains(fieldName))
        includedFields + `,${fieldName}`;
    }
    console.log(includedFields);

    await connection.end();

    return Response.json({ status: "ok", data: fields });
  } catch (error) {
    console.log(error);
    return Response.json({ status: "error", error: error.stack });
  }
}
