const mongoose = require("mongoose");
const { logger } = require("./utils/logger");

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gymmanager_final";

  try {
    await mongoose.connect(mongoUri);
    logger.info("Conectado a MongoDB", {
      database: mongoose.connection.name
    });
  } catch (error) {
    logger.error("Error de conexión con MongoDB", {
      error: error.message
    });
    process.exit(1);
  }
}

module.exports = { connectDB };
