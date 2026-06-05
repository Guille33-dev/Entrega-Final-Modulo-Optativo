const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('Falta la variable de entorno MONGODB_URI');
  }

  try {
    await mongoose.connect(mongoUri);
    logger.info('Conexión a MongoDB establecida correctamente');
  } catch (error) {
    logger.error('Error conectando con MongoDB', { error: error.message });
    throw error;
  }
}

module.exports = connectDB;
