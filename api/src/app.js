import express from "express";
import sequelize from "./infra/database.js";
import routes from "./routes/index.js";
import { logger } from "./utils/logger.js";

try {
  await sequelize.authenticate();
  logger.info("Database connected!");
} catch (err) {
  logger.error("Unable to connect to the database!", err);
  throw new Error("Service is currently unavailable. Please try again later.");
}

const app = express();

routes(app);

export default app;
