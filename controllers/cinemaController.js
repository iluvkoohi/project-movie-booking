const express = require("express");
const { validationResult } = require("express-validator");
const { cinemaValidator, getCinemasValidator, cinemaSeatsValidator, getCinemasSeatsValidator } = require("../const/route_validators");
const router = express.Router();
const { Cinema, CinemaSeats } = require("../models/cinema");
const { distanceBetween } = require("../utils/distanceBetween");

/*
    TODO: 
        done Create Cinema
        done Get all Cinemas
        done Edit Cinema name
        done Delete Cinema
    FIXME: 
        
*/
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];



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

router.post("/cinema/seats", cinemaSeatsValidator, async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());


        const { rows, cols, accountId, cinemaId } = req.body;

        // Delete if existed
        const cinema = await Cinema.findOne({ accountId });
        if (cinema) await Cinema.findOneAndDelete({ accountId });


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
        const body = { seats, ...req.body }
        return new CinemaSeats(body)
            .save()
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));

    } catch (error) {
        console.error(error);
    }
});

router.get("/cinema/seats", getCinemasSeatsValidator, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());

        const { accountId, cinemaId, movieId } = req.query;

        return CinemaSeats.find({ accountId, cinemaId, movieId })
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));

    } catch (error) {
        console.error(error);
    }
});

// TODO: Fill seats
router.put("/cinema/seats/fill", async (req, res) => {

})
module.exports = router;