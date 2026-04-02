import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const logLevel = process.env.LOG_LEVEL;
const logFilename = process.env.LOG_FILENAME;

const getLocalTime = () => {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour12: false,
  });
};

const logger = createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: getLocalTime }),
    printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
    ),
  ),
  transports: [
    //Prints logs to your terminal screen
    new transports.Console(),
    //Saves logs to a file
    new transports.File({
      filename: logFilename,
      maxsize: 20 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

export { logger, getLocalTime };
