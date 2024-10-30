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

    if (params.field === "Status") {
      let [fields, metadata] = await connection.query(
        `select ID,Name from Status union select ID,Name from SPStatus union select ID,Name from EkitStatus union select ID,Name from WaterBottleStatus union select ID,Name from SSDCoverStatus union select ID,Name from RadioStatus union select ID,Name from TestStatus union select ID,Name from SPMTStatus`,
      );
    } else {
      let [describedFields, describedMetadata] = await connection.query(
        `describe ${params.field}`,
      );

      let [fields, metadata] = await connection.query(
        `select ID,Name FROM ${params.field}`,
      );

      if (!fields.length) {
        let [fields, metadata] = await connection.query(
          `select ID,Name FROM ${params.field}Type where Avail=1`,
        );
      }
    }

    await connection.end();

    return Response.json({ status: "ok", data: fields });
  } catch (error) {
    return Response.json({ status: "error", error: error.stack });
  }
}
