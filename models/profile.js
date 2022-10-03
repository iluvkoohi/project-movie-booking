const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { userRoles } = require("../const/enum");

const options = {
  // capped: { size: 1024 },
  // bufferCommands: false,
  autoCreate: false
};



const ProfileSchema = new Schema({
  accountId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "accountId is required"],
  },
  name: {
    first: {
      type: String,
      required: [true, "firstName is required"],
    },
    last: {
      type: String,
      required: [true, "lastName is required"],
    },
  },
  avatar: { type: String },
  address: {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    coordinates: {
      latitude: {
        type: String,
        required: [true, "latitude is required"],
      },
      longitude: {
        type: String,
        required: [true, "longitude is required"],
      },
    },
  },
  contact: {
    email: {
      type: String,
    },
    number: {
      type: String,
    },
  },
  date: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  birthdate: {
    type: Date,
    required: [true, "birthday"],

  },
  account: {
    visibility: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    authorization: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: userRoles,
      required: [true, "role is required"],
    },
  },
  gallery: [],
}, options);

// const SubProfileSchema = new Schema({
//   accountId: {
//     type: String,
//     required: [true, "accountId is required"],
//   },

// }, options);

module.exports = {
  Profile: mongoose.model("profiles", ProfileSchema),
  //SubProfile: mongoose.model("profiles-sub", SubProfileSchema),
};


