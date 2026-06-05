const mongoose = require('mongoose');

const gymClassSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título de la clase es obligatorio'],
      trim: true,
      minlength: [3, 'El título debe tener al menos 3 caracteres'],
      maxlength: [80, 'El título no puede superar los 80 caracteres'],
    },
    level: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'El nivel debe ser beginner, intermediate o advanced',
      },
      default: 'beginner',
    },
    capacity: {
      type: Number,
      required: [true, 'La capacidad es obligatoria'],
      min: [1, 'La capacidad mínima es 1'],
      max: [60, 'La capacidad máxima es 60'],
    },
    durationMinutes: {
      type: Number,
      default: 60,
      min: [15, 'La duración mínima es 15 minutos'],
      max: [180, 'La duración máxima es 180 minutos'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startsAt: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: [true, 'La clase debe tener un entrenador asignado'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GymClass', gymClassSchema);
