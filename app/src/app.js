import express from "express";
import conectadaDatabase from "./config/dbConnect.js";
import routes from "./routes/index.js";

const pool = await conectadaDatabase();

pool.on("error", (err, client) => {
  console.error("Erro no cliente", err.message, err.stack);
});

pool.once("connect", (client) => {
  console.log("Novo cliente criado e conectado: ", client);
});

const app = express();
routes(app);

export default app;
