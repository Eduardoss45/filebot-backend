const fs = require("fs");
const path = require("path");

const LOG_FILE_PATH = path.join(__dirname, "../logs/app.log");

// Função para registrar mensagens de log
const logMessage = (message, level = "info") => {
  const logger = {
    info: (msg) => console.log(`INFO: ${msg}`),
    warn: (msg) => console.warn(`WARN: ${msg}`),
    error: (msg) => console.error(`ERROR: ${msg}`),
  };

  // Verificar se o nível de log existe
  if (typeof logger[level] === "function") {
    // Registra no console
    logger[level](message);

    // Registra no arquivo de log
    const logEntry = `${new Date().toISOString()} - ${level.toUpperCase()}: ${message}\n`;
    fs.appendFileSync(LOG_FILE_PATH, logEntry);
  } else {
    // Se o nível não for válido, registra como info
    logger.info(`Nível de log inválido, registrando como info: ${message}`);
  }
};

module.exports = { logMessage };
