import express from "express";
import routes from "./routes/index.js";
import { testDbConnect } from "./config/database.js";

const dbConectado = await testDbConnect();

if (!dbConectado) {
  console.error("Exiting due to database failure!");
  process.exit(1);
}

const app = express();
routes(app);

export default app;
