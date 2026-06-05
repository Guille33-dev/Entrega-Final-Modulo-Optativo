const express = require('express');
const Trainer = require('../models/Trainer');
const GymClass = require('../models/GymClass');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    title: 'GymManager API',
    description: 'Aplicación final de Node.js y Express para gestionar un gimnasio.',
  });
});

router.get('/classes', async (req, res, next) => {
  try {
    const classes = await GymClass.find().populate('trainer').sort({ startsAt: 1 });
    res.render('classes-list', { title: 'Listado de clases', classes });
  } catch (error) {
    next(error);
  }
});

router.get('/classes/new', async (req, res, next) => {
  try {
    const trainers = await Trainer.find({ available: true }).sort({ name: 1 });
    res.render('class-create', { title: 'Crear clase', trainers, error: null });
  } catch (error) {
    next(error);
  }
});

router.post('/classes', async (req, res, next) => {
  try {
    await GymClass.create(req.body);
    res.redirect('/classes');
  } catch (error) {
    const trainers = await Trainer.find({ available: true }).sort({ name: 1 });
    res.status(400).render('class-create', {
      title: 'Crear clase',
      trainers,
      error: error.message,
    });
  }
});

module.exports = router;
