import express from "express";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import criarReposta from "./utils/criarResposta.js";

try {
  await sequelize.authenticate();
  console.log("Database connected!");
} catch {
  console.log("Unable to connect to the data base!");

  throw new Error("Service is currently unavailable. Please try again later.");
}

const app = express();

app.use(function (req, res, next) {
  console.log("---HEADERS---");
  const headers = req.headers;
  console.log(headers);

  const apiKey = headers["x-api-key"];

  if (apiKey !== process.env.APP_KEY || !apiKey) {
    const resposta = criarReposta(
      false,
      "Usuário não autenticado",
      "x-api-key está errada ou não existe",
      401,
    );
    res.status(resposta.status).json(resposta);
  }
  next();
});

routes(app);

export default app;
