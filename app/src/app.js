import express from "express";
import sequelize from "./infra/database.js";
import routes from "./routes/index.js";
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

routes(app);

export default app;
