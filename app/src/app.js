import express from "express";
import sequelize from "./infra/database.js";
import routes from "./routes/index.js";
import criarReposta from "./utils/criarResposta.js";
import { logger } from "./utils/logger.js";

try {
  await sequelize.authenticate();
  logger.info("Database connected!");
} catch {
  logger.info("Unable to connect to the database!");
  throw new Error("Service is currently unavailable. Please try again later.");
}

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ success: true });
});

// Midleware to validate token
app.use(function (req, res, next) {
  try {
    logger.info("---HEADERS---");
    const headers = req.headers;
    logger.info(JSON.stringify(headers) || null);

    const apiKey = headers["x-api-key"];

    if (apiKey !== process.env.APP_KEY || !apiKey) {
      const resposta = criarReposta(
        false,
        "Usuário não autenticado",
        "x-api-key está errada ou não existe",
        401,
      );
      return res.status(resposta.status).json(resposta);
    }

    next();
  } catch (error) {
    const resposta = criarReposta(false, "Internal Error", error, 500);
    return res.status(resposta.status).json(resposta);
  }
});

routes(app);

export default app;
