const mongoose = require("mongoose");
const { Schema, model: Model } = mongoose;
const { String, ObjectId } = Schema.Types;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tripsHistory: [
    {
      type: ObjectId,
      ref: "Trips",
    },
  ],
});

module.exports = new Model("User", UserSchema);
