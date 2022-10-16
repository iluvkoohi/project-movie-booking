const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CinemaMovieSchema = new Schema({
    _id: {
        type: String,
        required: [true, "Movie Id is required"]
    },
    cinemaId: {
        type: String,
        required: [true, "Cinema Id is required"]
    },
    poster: {
        type: String,
        required: [true, "poster is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    visibility: { default: false },
    dateTime: {
        start: {
            type: String,
            required: [true, "DateTime start is required"]
        },
        end: {
            type: String,
            required: [true, "DateTime end is required"]
        }
    }
}, { _id: false });

const CinemaSeatsSchema = new Schema({
    _id: {
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
}, { _id: false });


const CinemaSchema = new Schema({
    cinemaId: {
        type: String,
        required: [true, "Cinema Id is required"]
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
    CinemaMovies: mongoose.model("cinema-movies", CinemaMovieSchema),
    CinemaSeats: mongoose.model("cinema-seats", CinemaSeatsSchema)
}
