const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driverName: { type: String, required: true, trim: true },
  origin: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  departureTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  passengers: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);