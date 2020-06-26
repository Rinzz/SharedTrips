const mongoose = require("mongoose");

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
  trippsHistory: {
    type: "ObjectId",
    ref: "Tripps",
  },
});

module.exports = mongoose.model("User", UserSchema);
