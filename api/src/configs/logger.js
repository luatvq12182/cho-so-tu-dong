const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
});

const logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.Console(), dailyRotateFileTransport],
});

module.exports = logger;
