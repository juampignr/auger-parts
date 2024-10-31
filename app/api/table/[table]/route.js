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

    let statusTables = [];

    let [fields, metadata] = await connection.query(
      `SELECT DISTINCT c.column_name, c.column_type ,t.table_name AS associated_table FROM information_schema.columns c LEFT JOIN information_schema.tables t ON c.column_name = t.table_name WHERE c.table_name = '${params.table}' AND c.column_name NOT IN ('inTime', 'UserID', 'ID')`,
    );

    await connection.end();

    return Response.json({ status: "ok", data: fields });
  } catch (error) {
    return Response.json({ status: "error", error: error.stack });
  }
}

export async function POST(request, { params }) {
  let data = await request.formData();
  data = Object.fromEntries(data.entries());

  let parsedData = {};
  let templateFields = {};
  let oneByOne = false;
  let update = false;
  let id;

  if (data["Update:string:0"]) {
    update = true;

    id = data["ID:string:0"];

    delete data["ID:string:0"];
    delete data["Name:string:0"];
    delete data["Update:string:0"];
  }

  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const [name, type, template] = key.split(":");
      const element = data[key];

      if (parseInt(template)) {
        templateFields[name] = data[key];
      }

      if (type === "string") {
        if (isNaN(element)) {
          parsedData[name] = `'${element}'`;
        } else {
          parsedData[name] = parseInt(element);
        }
      } else {
        parsedData[name] = element;
      }
    }
  }

  try {
    const connection = await mysql.createConnection({
      host: "db.auger.org.ar",
      user: "PMS",
      password: "Mi:kARgwpb",
      database: "PMS",
    });

    if (update) {
      let encodedUpdate = "";

      for (const key in parsedData) {
        encodedUpdate += `${key} = ${parsedData[key]}, `;
      }

      let ids = "";

      for (const name of id.split(",")) {
        ids += `"${name}",`;
      }

      let [result, metadata] = await connection.query(
        `update ${params.table} SET ${encodedUpdate.replace(/,\s*$/, "")} where Name IN (${ids.replace(/,$/, "")})`,
      );
    } else {
      const nameField = data["Name:string:0"];

      const insertStatement = `insert into ${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`;
      //const insertHistoryStatement = `insert into zHis_${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`;

      if (nameField.includes(",")) {
        for (const name of nameField.split(",")) {
          parsedData["Name"] = `'${name}'`;

          let [result, metadata] = await connection.query(insertStatement);
        }
      } else {
        let [result, metadata] = await connection.query(insertStatement);

        console.log(Object.keys(result));
        console.log(metadata);
      }
    }
    await connection.end();

    return Response.json({ status: "ok", data: "changeme" });
  } catch (error) {
    console.log("### ERROR ###");

    console.log(error);
    return Response.json({ status: "error", error: error.stack });
  }
}
