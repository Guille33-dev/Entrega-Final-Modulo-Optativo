const express = require('express');
const Booking = require('../models/Booking');
const { authenticate, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('member')
      .populate({ path: 'gymClass', populate: { path: 'trainer' } })
      .sort({ bookedAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('member')
      .populate({ path: 'gymClass', populate: { path: 'trainer' } });
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
    return res.json(booking);
  } catch (error) {
    return next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    return res.status(201).json(booking);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authenticate, authorizeRoles('admin', 'trainer'), async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
    return res.json(booking);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
    return res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
