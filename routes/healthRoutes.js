const express = require("express");
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

const router = express.Router();

router.get("/health", async (req, res) => {
  const apiStatus = "ok";
  const dbState = mongoose.connection.readyState;
  const dbStatusByState = {
    0: "desconectada",
    1: "conectada",
    2: "conectando",
    3: "desconectando"
  };

  try {
    if (dbState !== 1) {
      logger.warn("Health check fallido: base de datos no conectada", {
        dbState,
        dbStatus: dbStatusByState[dbState] || "desconocido"
      });

      return res.status(503).json({
        status: "error",
        api: apiStatus,
        database: dbStatusByState[dbState] || "desconocido",
        timestamp: new Date().toISOString()
      });
    }

    await mongoose.connection.db.admin().ping();

    logger.info("Health check correcto", {
      database: "conectada"
    });

    return res.status(200).json({
      status: "ok",
      api: apiStatus,
      database: "conectada",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Health check fallido: error de ping en base de datos", {
      error: error.message
    });

    return res.status(503).json({
      status: "error",
      api: apiStatus,
      database: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
