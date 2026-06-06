const express = require("express");
const mongoose = require("mongoose");
const Trainer = require("../models/Trainer");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ name: 1 });
    res.json(trainers);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del entrenador no es válido." });
    }

    const trainer = await Trainer.findById(req.params.id);

    if (!trainer) {
      return res.status(404).json({ error: "Entrenador no encontrado." });
    }

    res.json(trainer);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del entrenador no es válido." });
    }

    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!trainer) {
      return res.status(404).json({ error: "Entrenador no encontrado." });
    }

    res.json(trainer);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id del entrenador no es válido." });
    }

    const trainer = await Trainer.findByIdAndDelete(req.params.id);

    if (!trainer) {
      return res.status(404).json({ error: "Entrenador no encontrado." });
    }

    res.json({ message: "Entrenador eliminado correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
