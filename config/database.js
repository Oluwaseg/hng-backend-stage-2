const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on("connect", () => {
  console.log("Successfully connected to PostgreSQL!");
});

pool.on("error", (err) => {
  console.error("Error connecting to the database:", err.message);
});

const testConnection = async () => {
  try {
    const result = await pool.query("SELECT $1::text as status", [
      "Connection test",
    ]);
    console.log(result.rows[0].status);
  } catch (err) {
    console.error("Error during connection test:", err.message);
  }
};

const getPool = () => pool;

module.exports = {
  getPool,
  testConnection,
};
