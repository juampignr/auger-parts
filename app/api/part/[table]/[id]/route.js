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

    let includedFields = "";
    let [fields, metadata] = await connection.query(
      `show columns from ${table}`,
    );

    for (const field of fields) {
      if (!["inTime", "UserID", "ID"].includes(field.Field))
        includedFields += `${field.Field},`;
    }

    let [items, itemsMetadata] = await connection.query(
      `select ${includedFields.replace(/,$/, "")} from ${table} where Name like '%${id}%'`,
    );

    await connection.end();

    return Response.json({ status: "ok", data: items });
  } catch (error) {
    console.log(error);
    return Response.json({ status: "error", error: error.stack });
  }
}
