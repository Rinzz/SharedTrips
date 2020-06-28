const mongoose = require("mongoose");
const { Schema, model: Model } = mongoose;
const { String, Number, ObjectId } = Schema.Types;

const TripSchema = new Schema({
  startPoint: {
    type: String,
    required: true,
  },
  endPoint: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  carImage: {
    type: String,
    required: true,
  },
  buddies: [
    {
      type: ObjectId,
      email: String,
      ref: "User",
    },
  ],
  creator: {
    type: ObjectId,
    email: String,
    ref: "User",
  },
});

module.exports = new Model("Trip", TripSchema);
