import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const maxConectionsdatabase = await database.query("SHOW max_connections");
  const maxConectionsdatabaseValue =
    maxConectionsdatabase.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const usedConections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const usedConectionsValue = usedConections.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_conections: parseInt(maxConectionsdatabaseValue),
        used_conections: usedConectionsValue,
      },
    },
  });
}

export default status;
