const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    accountId: {
        type: String,
        required: [true, "accountId is required"]
    },
    cinemaId: {
        type: String,
        required: [true, "Cinema Id is required"]
    },
    title: {
        type: String,
        required: [true, "title is required"]
    },
    price: {
        type: Number,
        required: [true, "price is required"]
    },
    visibility: { default: false },
    dateTime: {
        start: {
            type: String,
            required: [true, "dateTime start is required"]
        },
        end: {
            type: String,
            required: [true, "dateTime end is required"]
        }
    }
});


module.exports = Movie = mongoose.model("movies", MovieSchema);
