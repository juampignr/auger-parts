import configuration from "/appConfig.json";
import mysql from "mysql2/promise";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request, { params }) {
  try {
    const connection = await mysql.createConnection({
      host: "db.auger.org.ar",
      user: "mocca",
      password: "sibyll",
      database: "PMS",
    });

    let [fields, metadata] = await connection.query(
      `SELECT DISTINCT c.column_name, c.column_type ,t.table_name AS associated_table FROM information_schema.columns c LEFT JOIN information_schema.tables t ON c.column_name = t.table_name WHERE c.table_name = '${params.table}' AND c.column_name NOT IN ('inTime', 'UserID', 'ID')`,
    );

    console.log(fields);

    await connection.end();

    return Response.json({ status: "ok", data: fields });
  } catch (error) {
    return Response.json({ status: "error", error: error.stack });
  }
}

export async function POST(request, { params }) {
  try {
    let data = await request.formData();
    data = Object.fromEntries(data.entries());

    let parsedData = {};

    const connection = await mysql.createConnection({
      host: "db.auger.org.ar",
      user: "PMS",
      password: "Mi:kARgwpb",
      database: "PMS",
    });

    console.log("### QUERY ###");

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const [name, type] = key.split(":");
        const element = data[key];

        if (type === "string") {
          parsedData[name] = `'${element}'`;
        } else {
          parsedData[name] = element;
        }
      }
    }
    console.log(
      `insert into ${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`,
    );

    let [result, metadata] = await connection.query(
      `insert into ${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`,
    );

    console.log("### RESULT ###");

    console.log(result);
    console.log(metadata);

    await connection.end();

    return Response.json({ status: "ok", data: "changeme" });
  } catch (error) {
    console.log("### ERROR ###");

    console.log(error);
    return Response.json({ status: "error", error: error.stack });
  }
}
