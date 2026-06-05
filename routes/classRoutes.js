const express = require('express');
const GymClass = require('../models/GymClass');
const { authenticate, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const classes = await GymClass.find().populate('trainer').sort({ startsAt: 1 });
    return res.json(classes);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const gymClass = await GymClass.findById(req.params.id).populate('trainer');
    if (!gymClass) return res.status(404).json({ message: 'Clase no encontrada' });
    return res.json(gymClass);
  } catch (error) {
    return next(error);
  }
});

router.post('/', authenticate, authorizeRoles('admin', 'trainer'), async (req, res, next) => {
  try {
    const gymClass = await GymClass.create(req.body);
    return res.status(201).json(gymClass);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authenticate, authorizeRoles('admin', 'trainer'), async (req, res, next) => {
  try {
    const gymClass = await GymClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!gymClass) return res.status(404).json({ message: 'Clase no encontrada' });
    return res.json(gymClass);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const gymClass = await GymClass.findByIdAndDelete(req.params.id);
    if (!gymClass) return res.status(404).json({ message: 'Clase no encontrada' });
    return res.json({ message: 'Clase eliminada correctamente' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
