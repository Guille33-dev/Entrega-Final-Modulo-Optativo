const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del usuario no es válido." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const { username, password, roles, active } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "El nombre de usuario ya está en uso." });
    }

    const user = await User.create({
      username,
      password,
      roles: Array.isArray(roles) && roles.length > 0 ? roles : ["user"],
      active
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del usuario no es válido." });
    }

    const user = await User.findById(req.params.id).select("+password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const { username, password, roles, active } = req.body;

    if (username !== undefined) user.username = username;
    if (password !== undefined) user.password = password;
    if (roles !== undefined) user.roles = roles;
    if (active !== undefined) user.active = active;

    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del usuario no es válido." });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
