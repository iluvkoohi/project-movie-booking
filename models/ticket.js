const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = {
    // capped: { size: 1024 },
    // bufferCommands: false,
    autoCreate: false
};

const VerificationSchema = new Schema({
    accountId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "accountId is required"],
    },
    img: {
        type: String,
        required: [true, "img is required"],
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
    status: {
        type: String,
        enum: ["pending", "completed", "rejected"],
        required: [true, "status is required"],
    },
}, options);

module.exports = Verification = mongoose.model("verifications", VerificationSchema);