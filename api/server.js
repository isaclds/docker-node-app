import dotenv from "dotenv/config";
import app from "./src/app.js";
import { logger } from "./src/utils/logger.js";

const PORT = process.env.API_PORT;

app.listen(PORT, () => {
  logger.info("Escutando em " + PORT);
});
