const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', async (req, res) => {
  const mongoReady = mongoose.connection.readyState === 1;
  let databasePing = false;

  if (mongoReady && mongoose.connection.db) {
    try {
      await mongoose.connection.db.admin().ping();
      databasePing = true;
    } catch (error) {
      databasePing = false;
    }
  }

  const status = mongoReady && databasePing ? 'ok' : 'error';

  return res.status(status === 'ok' ? 200 : 503).json({
    status,
    api: 'ok',
    database: {
      connected: mongoReady,
      ping: databasePing,
      readyState: mongoose.connection.readyState,
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
