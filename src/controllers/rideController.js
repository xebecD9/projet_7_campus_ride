const Ride = require('../models/Ride');

exports.createRide = async (req, res) => {
  try {
    const { driverName, origin, destination, departureTime, availableSeats, price } = req.body;
    if (!driverName || !origin || !destination || !departureTime || availableSeats === undefined) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }
    const newRide = await Ride.create({
      driverName, origin, destination, departureTime,
      availableSeats, price: price || 0, passengers: []
    });
    res.status(201).json(newRide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRides = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    let filter = {};
    if (origin) filter.origin = { $regex: new RegExp(origin, 'i') };
    if (destination) filter.destination = { $regex: new RegExp(destination, 'i') };
    const rides = await Ride.find(filter).sort({ departureTime: 1 });
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ error: 'Trajet non trouvé' });
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bookRide = async (req, res) => {
  try {
    const { id } = req.params;
    const { passengerName } = req.body;
    if (!passengerName || passengerName.trim() === '') {
      return res.status(400).json({ error: 'Le nom du passager est requis' });
    }
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: id, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 }, $push: { passengers: passengerName.trim() } },
      { new: true, runValidators: true }
    );
    if (!updatedRide) {
      return res.status(400).json({ error: 'Plus de places disponibles ou trajet inexistant', code: 'OVERBOOKING' });
    }
    res.status(200).json({ message: 'Réservation confirmée', ride: updatedRide });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};