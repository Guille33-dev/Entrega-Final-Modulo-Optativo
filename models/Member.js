const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'El nombre completo del socio es obligatorio'],
      trim: true,
      minlength: [3, 'El nombre completo debe tener al menos 3 caracteres'],
      maxlength: [80, 'El nombre completo no puede superar los 80 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El email del socio es obligatorio'],
      trim: true,
      lowercase: true,
      minlength: [6, 'El email debe tener al menos 6 caracteres'],
      maxlength: [120, 'El email no puede superar los 120 caracteres'],
    },
    membershipType: {
      type: String,
      enum: {
        values: ['basic', 'premium', 'vip'],
        message: 'La membresía debe ser basic, premium o vip',
      },
      default: 'basic',
    },
    monthlyFee: {
      type: Number,
      required: [true, 'La cuota mensual es obligatoria'],
      min: [0, 'La cuota mensual no puede ser negativa'],
      max: [300, 'La cuota mensual no puede superar los 300 euros'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
