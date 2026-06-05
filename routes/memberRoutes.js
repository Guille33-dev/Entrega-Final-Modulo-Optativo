const express = require('express');
const Member = require('../models/Member');
const { authenticate, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    const members = await Member.find().sort({ fullName: 1 });
    return res.json(members);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Socio no encontrado' });
    return res.json(member);
  } catch (error) {
    return next(error);
  }
});

router.post('/', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const member = await Member.create(req.body);
    return res.status(201).json(member);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!member) return res.status(404).json({ message: 'Socio no encontrado' });
    return res.json(member);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', authenticate, authorizeRoles('admin'), async (req, res, next) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Socio no encontrado' });
    return res.json({ message: 'Socio eliminado correctamente' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
