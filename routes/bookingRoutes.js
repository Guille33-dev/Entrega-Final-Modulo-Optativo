const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const { requireAuth } = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("member")
      .populate({ path: "gymClass", populate: { path: "trainer" } })
      .sort({ bookedAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id de la reserva no es válido." });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("member")
      .populate({ path: "gymClass", populate: { path: "trainer" } });

    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    const populatedBooking = await booking.populate([
      { path: "member" },
      { path: "gymClass", populate: { path: "trainer" } }
    ]);
    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, requireRole("admin", "profesor"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id de la reserva no es válido." });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "El id de la reserva no es válido." });
    }

    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }

    res.json({ message: "Reserva eliminada correctamente." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
