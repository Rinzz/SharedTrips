const Trip = require("../models/trip");
const User = require("../models/user");

const getAllTrips = async (req, res, next) => {
  req.trips = await Trip.find().lean();
  next();
};

const offerTrip = async (req, res) => {
  const { startAndEndPoint, dateTime, carImage, seats, description } = req.body;
  const startPoint = startAndEndPoint.split(" - ")[0];
  const endPoint = startAndEndPoint.split(" - ")[1];
  const date = dateTime.split(" - ")[0];
  const time = dateTime.split(" - ")[1];
  const creator = req.user;

  try {
    const trip = new Trip({
      startPoint,
      endPoint,
      date,
      time,
      carImage,
      seats,
      description,
      creator,
    });

    await trip.save();
  } catch (err) {
    return {
      error: true,
      message: err,
    };
  }
};

const getTrip = async (req, res, next) => {
  try {
    const id = req.params.id;
    req.trip = await Trip.findById(id).populate("buddies").lean();
    req.creator = await User.findById(req.trip.creator).lean();
    next();
  } catch (err) {}
};

const joinTrip = async (tripId, userId, seats) => {
  try {
    await Trip.findByIdAndUpdate(tripId, {
      $addToSet: {
        buddies: [userId],
      },
      $set: {
        seats: seats - 1,
      },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        tripsHistory: [tripId],
      },
    });
  } catch (err) {
    return err;
  }
};

const closeTrip = async (tripId) => {
  try {
    await Trip.findByIdAndDelete(tripId);
  } catch (err) {
    return err;
  }
};

module.exports = {
  getAllTrips,
  offerTrip,
  getTrip,
  joinTrip,
  closeTrip
};
