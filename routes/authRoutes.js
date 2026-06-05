const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createAccessToken, createRefreshToken } = require('../utils/tokens');

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Ya existe un usuario con ese nombre' });
    }

    const user = await User.create({ username, password, role });
    return res.status(201).json({ message: 'Usuario registrado correctamente', user });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    if (!user.active) {
      return res.status(403).json({ message: 'El usuario está desactivado' });
    }

    return res.json({
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
      user,
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Debes enviar un refreshToken' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);

    if (!user || !user.active) {
      return res.status(401).json({ message: 'Usuario no válido para refrescar el token' });
    }

    return res.json({ accessToken: createAccessToken(user) });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido o caducado' });
  }
});

module.exports = router;
