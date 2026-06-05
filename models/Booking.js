const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'La reserva debe estar asociada a un socio'],
    },
    gymClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GymClass',
      required: [true, 'La reserva debe estar asociada a una clase'],
    },
    status: {
      type: String,
      enum: {
        values: ['reserved', 'cancelled', 'attended'],
        message: 'El estado debe ser reserved, cancelled o attended',
      },
      default: 'reserved',
    },
    paid: {
      type: Boolean,
      default: false,
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [200, 'Las notas no pueden superar los 200 caracteres'],
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
