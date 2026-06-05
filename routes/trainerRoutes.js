const express = require('express');
const Trainer = require('../models/Trainer');
const { authenticate, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 });
    return res.json(trainers);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Entrenador no encontrado' });
    return res.json(trainer);
  } catch (error) {
    return next(error);
  }
});

router.post('/', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    return res.status(201).json(trainer);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!trainer) return res.status(404).json({ message: 'Entrenador no encontrado' });
    return res.json(trainer);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Entrenador no encontrado' });
    return res.json({ message: 'Entrenador eliminado correctamente' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
