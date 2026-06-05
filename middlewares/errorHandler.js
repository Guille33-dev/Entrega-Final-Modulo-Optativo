const logger = require('../utils/logger');

function errorHandler(error, req, res, next) {
  logger.error('Error controlado por middleware', {
    method: req.method,
    path: req.originalUrl,
    error: error.message,
  });

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({ message: 'Error de validación', errors });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador no válido' });
  }

  return res.status(error.statusCode || 500).json({
    message: error.message || 'Error interno del servidor',
  });
}

module.exports = errorHandler;
