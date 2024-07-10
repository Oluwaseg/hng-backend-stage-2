const { Client } = require("pg");

const connectToDatabase = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    const result = await client.query("SELECT $1::text as status", [
      "Successfully connected to PostgreSQL!",
    ]);
    console.log(result.rows[0].status);
  } catch (err) {
    console.error("Error connecting to the database:", err.message);
  } finally {
    await client.end();
  }
};

module.exports = connectToDatabase;
