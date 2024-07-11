// test/setup.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for testing purposes if not needed
});

// Optional: Log connection status
pool.on("connect", () => {
  console.log("Connected to PostgreSQL (test environment)!");
});

pool.on("error", (err) => {
  console.error(
    "Error connecting to PostgreSQL (test environment):",
    err.message
  );
});

// Clear database before tests
beforeEach(async () => {
  await pool.query("DELETE FROM users");
  await pool.query("DELETE FROM organisations");
});

// Close the pool after all tests are done
afterAll(async () => {
  await pool.end();
});

module.exports = {
  pool,
};
