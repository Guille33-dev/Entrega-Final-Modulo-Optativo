const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del entrenador es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
      maxlength: [60, 'El nombre no puede superar los 60 caracteres'],
    },
    specialty: {
      type: String,
      enum: {
        values: ['fitness', 'yoga', 'crossfit', 'pilates', 'boxing'],
        message: 'La especialidad debe ser fitness, yoga, crossfit, pilates o boxing',
      },
      required: [true, 'La especialidad del entrenador es obligatoria'],
    },
    experienceYears: {
      type: Number,
      required: [true, 'Los años de experiencia son obligatorios'],
      min: [0, 'La experiencia no puede ser negativa'],
      max: [50, 'La experiencia no puede superar los 50 años'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    hiredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
