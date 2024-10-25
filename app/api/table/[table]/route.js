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
  try {
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

    console.log(`Update operation: ${update}`);

    const connection = await mysql.createConnection({
      host: "db.auger.org.ar",
      user: "PMS",
      password: "Mi:kARgwpb",
      database: "PMS",
    });

    console.log(data);

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const [name, type, template] = key.split(":");
        console.log(name);
        const element = data[key];
        console.log(element);

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

    console.log(parsedData);

    if (update) {
      let encodedUpdate = "";

      for (const key in parsedData) {
        encodedUpdate += `${key} = ${parsedData[key]}, `;
      }

      let [result, metadata] = await connection.query(
        `update ${params.table} SET ${encodedUpdate.replace(/,\s*$/, "")} where Name = '${id}'`,
      );

      console.log("### RESULT ###");

      console.log(result);
      console.log(metadata);
    } else {
      if (Object.keys(templateFields).length) {
        for (let [i, n] = [0, parseInt(parsedData["Avail"])]; i < n; i++) {
          for (const key in templateFields) {
            if (Object.hasOwnProperty.call(templateFields, key)) {
              const value = templateFields[key].replace("#", i);
              parsedData[key] = value;
            }
          }

          console.log(
            `Inserting one by one: insert into ${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`,
          );
          let [result, metadata] = await connection.query(
            `insert into ${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`,
          );

          console.log("### RESULT ###");

          console.log(result);
          console.log(metadata);
        }
      } else {
        console.log(
          `Inserting all at once: insert into ${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`,
        );
        let [result, metadata] = await connection.query(
          `insert into ${params.table}(${Object.keys(parsedData).join(", ")}) values (${Object.values(parsedData).join(", ")})`,
        );

        console.log("### RESULT ###");

        console.log(result);
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
