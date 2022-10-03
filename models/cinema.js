const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CinemaSeatsSchema = new Schema({
    accountId: {
        type: String,
        required: [true, "Account Id is required"]
    },
    cinemaId: {
        type: String,
        required: [true, "Cinema Id is required"]
    },
    movieId: {
        type: String,
        required: [true, "Movie Id Id is required"]
    },
    rows: {
        type: Number,
        required: [true, "Rows is required"]
    },
    cols: {
        type: Number,
        required: [true, "Cols is required"]
    },
    seats: []
});


const CinemaSchema = new Schema({
    accountId: {
        type: String,
        required: [true, "Account Id is required"]
    },
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    address: {
        name: {
            type: String,
            required: [true, "Address name is required"]
        },
        coordinates: {
            latitude: {
                type: String,
                required: [true, "Latitude is required"]
            },
            longitude: {
                type: String,
                required: [true, "Longitude is required"]
            }
        }
    },
    visibility: {
        type: Boolean,
        default: false
    },
    dateTime: {
        open: {
            type: Number,
            required: [true, "DateTime open is required"]
        },
        close: {
            type: Number,
            required: [true, "DateTime close is required"]
        }
    }

});


module.exports = {
    Cinema: mongoose.model("cinemas", CinemaSchema),
    CinemaSeats: mongoose.model("cinema-seats", CinemaSeatsSchema)
}
