const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const PaymentSchema = new Schema({
    cinema: {
        type: Map,
        required: [true, "cinema  is required"]
    },
    movie: {
        type: Map,
        required: [true, "movie  is required"]
    },
    customer: {
        type: Map,
        required: [true, "customer  is required"]
    },
    amount: {
        type: Number,
        required: [true, "amount is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, options);

module.exports = Payment = mongoose.model("payments", PaymentSchema);
