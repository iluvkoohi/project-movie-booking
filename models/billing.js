const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { paymentType } = require("../const/enum");

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const ArtSchema = new Schema({
    _id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "_id is required"]
    },
    title: {
        type: String,
        required: [true, "title is required"]
    },
    description: {
        type: String,
        required: [true, "description is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },
}, { _id: false })

const BillingSchema = new Schema({
    transactionId: {
        type: String,
        required: [true, "transactionId  is required"]
    },
    header: {
        artist: {
            accountId: {
                type: String,
                required: [true, "accountId is required"]
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
            avatar: {
                type: String,
                required: [true, "avatar is required"]
            },
        },
        customer: {
            accountId: {
                type: String,
                required: [true, "accountId is required"]
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
            avatar: {
                type: String,
                required: [true, "avatar is required"]
            },
        },
    },
    art: ArtSchema,
    date: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
    },
}, options)

module.exports = Billing = mongoose.model("billings", BillingSchema);
