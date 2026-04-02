import dotenv from "dotenv";
import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";
dotenv.config();

const PORT = process.env.API_PORT;

app.listen(PORT, () => {
  logger.info("Escutando");
});
