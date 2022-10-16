const express = require("express");
const { v4: uuidV4 } = require("uuid");
const { validationResult } = require("express-validator");
const { cinemaValidator, getCinemasValidator, cinemaSeatsValidator, getCinemasSeatsValidator } = require("../const/route_validators");
const router = express.Router();
const { Cinema, CinemaSeats, CinemaMovies } = require("../models/cinema");
const { distanceBetween } = require("../utils/distanceBetween");

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


// #region  
router.post("/cinema", cinemaValidator, async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());

        const cinema = await Cinema.findOne({ accountId: req.body.accountId, name: req.body.name });
        if (cinema) return res
            .status(400)
            .json({ message: "Cinema name already exist, please try a new one." });

        const open = new Date(req.body.dateTime.open);
        const close = new Date(req.body.dateTime.close);

        req.body.dateTime.open = parseInt(open.getHours() + "" + open.getMinutes());
        req.body.dateTime.close = parseInt(close.getHours() + "" + close.getMinutes());

        return new Cinema(req.body)
            .save()
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));

    } catch (error) {
        console.error(error);
    }
});

router.get("/cinema", getCinemasValidator, (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());

        const { latitude, longitude } = req.query;
        const date = new Date();
        const hour = date.getHours();
        const time = date.getMinutes();


        return Cinema.find({ 'dateTime.close': { $gte: parseInt(hour + "" + time) } })
            .select({ __v: 0 })
            .then((value) => {
                const result = value
                    .map((element, _) => {
                        const fromLat = element.address.coordinates.latitude;
                        const fromLon = element.address.coordinates.longitude;
                        return {
                            ...element._doc,
                            distanceBetween: distanceBetween(fromLat, fromLon, latitude, longitude, "K").toFixed(1) + "km"
                        };
                    })
                    .sort((a, b) => {
                        const value1 = parseFloat(a.distanceBetween.replace(/[^\d.-]/g, ''));
                        const value2 = parseFloat(b.distanceBetween.replace(/[^\d.-]/g, ''));
                        return value1 - value2;
                    });

                return res.status(200).json(result);
            })
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
});

router.get("/cinema/:id", async (req, res) => {
    const cinemaId = req.params.id;
    return Cinema.find({ cinemaId })
        .select({ __v: 0 })
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
})

router.put("/cinema", (req, res) => {
    try {
        const { _id, name, dateTime } = req.body;
        const open = new Date(dateTime.open);
        const close = new Date(dateTime.close);
        const update = {
            name,
            dateTime: {
                open: parseInt(open.getHours() + "" + open.getMinutes()),
                close: parseInt(close.getHours() + "" + close.getMinutes())
            }
        }
        return Cinema.findByIdAndUpdate(_id, update, { new: true })
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
});

router.delete("/cinema/:id", (req, res) => {
    try {
        return Cinema.findByIdAndDelete(req.params.id)
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
})

// #endregion 

// #region 
router.post("/cinema/movie", async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());

        const { cinemaId } = req.body;
        const { rows, cols } = req.body.movie.seatCount;
        const generatedMovieId = uuidV4();

        let seats = [];


        for (let row = 1; row < rows + 1; row++) {
            for (let col = 1; col < cols + 1; col++) {
                seats.push({
                    seat: LETTERS[row - 1] + col,
                    occupied: false,
                    customer: 'none'
                });
            }
        }

        // Create Cinema movie and Movie seats
        const movie = await new CinemaMovies({
            _id: generatedMovieId,
            cinemaId,
            ...req.body.movie
        }).save();

        const movieSeats = await new CinemaSeats({
            _id: generatedMovieId,
            rows,
            cols,
            seats
        }).save();

        return res.status(200).json({ movie, movieSeats });

    } catch (error) {
        console.error(error);
    }
});

// GET ALL CINEMA MOVIES BY CINEMA ID
router.get("/cinema/movie/:cinemaId", async (req, res) => {
    try {
        const cinemaId = req.params.cinemaId;
        return CinemaMovies.find({ cinemaId })
            .select({ __v: 0 })
            .then(async (value) => {
                let resultArray = [];
                for (el of value) {
                    const seats = await CinemaSeats.findOne({ _id: el._id }).select({ __v: 0 });
                    console.log(seats)
                    resultArray.push({ movie: el, seats });
                }
                return res.status(200).json(resultArray);
            })
            .catch((err) => res.status(400).json(err));

    } catch (error) {
        console.error(error);
    }
});

// GET ONE CINEMA MOVIE BY ID
router.get("/cinema/movie/s/:movieId", async (req, res) => {
    try {
        const _id = req.params.movieId;
        const movie = await CinemaMovies.findById(_id).select({ __v: 0 });
        const seats = await CinemaSeats.findById(_id).select({ __v: 0 });

        return res.status(200).json({ movie, seats });
    } catch (error) {
        console.error(error);
    }
});

router.put("/cinema/movie/seat/fill", async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());

        const { _id, seat, occupied, customer } = req.body;
        const update = {
            $set: {
                'seats.$[element].occupied': occupied,
                'seats.$[element].customer': customer
            },
        };
        const options = {
            new: true,
            "arrayFilters": [
                { "element.seat": seat }
            ]
        }

        CinemaSeats.findOneAndUpdate({ _id }, update, options)
            .then((value) => {
                if (!value) return res.status(400).json({ message: "Update failed" });
                return res.status(200).json(value);
            })
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
})
// #endregion 

module.exports = router;