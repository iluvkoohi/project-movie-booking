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
  account: {
    permitUrl: { type: String },
    profile: {
      imageUrl: {
        type: String,
        required: [true, "imageUrl is required"],
      },
      name: {
        type: String,
        required: [true, "name is required"],
      },
      givenName: {
        type: String,
        required: [true, "givenName is required"],
      },
      familyName: {
        type: String,
        required: [true, "familyName is required"],
      }
    },
    verified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  date: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: { type: Date }
  },
}, options);

module.exports = User = mongoose.model("users", UserSchema);
