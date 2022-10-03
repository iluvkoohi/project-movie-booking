const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};


const ImageSchema = new Schema({
    url: String,
    description: String,
    title: String,
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
})

const BuyerSchema = new Schema({
    transactionId: { type: String },
    name: { type: Map },
    price: { type: Number },
    date: { type: Date, default: Date.now },
})

const ArtSchema = new Schema({
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "accountId is required"],
    },
    price: {
        type: Number,
        required: [true, "price is required"],
    },
    title: {
        type: String,
        required: [true, "title is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    images: [ImageSchema],
    tags: [String],
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
    availability: {
        type: Boolean,
        default: true
    },
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
    buyer: BuyerSchema,
}, options);

module.exports = Art = mongoose.model("arts", ArtSchema);
