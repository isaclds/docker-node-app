import pg from "pg";
const { Pool } = pg;

async function conectadaDatabase() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10, // Max number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  });
}

export default conectadaDatabase;
