const express = require("express");
const mongoose = require("mongoose");
const GymClass = require("../models/GymClass");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const classes = await GymClass.find().populate("trainer").sort({ startsAt: 1 });
    res.json(classes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id de la clase no es válido." });
    }

    const gymClass = await GymClass.findById(req.params.id).populate("trainer");

    if (!gymClass) {
      return res.status(404).json({ error: "Clase no encontrada." });
    }

    res.json(gymClass);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("admin", "profesor"), async (req, res, next) => {
  try {
    const gymClass = await GymClass.create(req.body);
    const populatedClass = await gymClass.populate("trainer");
    res.status(201).json(populatedClass);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin", "profesor"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id de la clase no es válido." });
    }

    const gymClass = await GymClass.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("trainer");

    if (!gymClass) {
      return res.status(404).json({ error: "Clase no encontrada." });
    }

    res.json(gymClass);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id de la clase no es válido." });
    }

    const gymClass = await GymClass.findByIdAndDelete(req.params.id);

    if (!gymClass) {
      return res.status(404).json({ error: "Clase no encontrada." });
    }

    res.json({ message: "Clase eliminada correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
