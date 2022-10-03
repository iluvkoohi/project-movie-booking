const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { userRoles } = require("../const/enum");

const options = {
  // capped: { size: 1024 },
  // bufferCommands: false,
  autoCreate: false
};

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "email is required"],
  },
  hashValue: {
    type: String,
    required: [true, "hashValue is required"],
  },
  role: {
    type: String,
    enum: userRoles,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  date: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      // default: Date.now,
    }
  },
}, options);

module.exports = User = mongoose.model("users", UserSchema);
