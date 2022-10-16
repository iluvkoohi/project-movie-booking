const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");


router.post("/payment", (req, res) => {
    return new Payment(req.body)
        .save()
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
})

router.get("/payment/cinema/:id", (req, res) => {
    const cinemaId = req.params.id;
    return Payment.find({ 'cinema.cinemaId': cinemaId })
        .select({ __v: 0 })
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
});

router.get("/payment/customer/:id", (req, res) => {
    const accountId = req.params.id;
    return Payment.find({ 'customer.accountId': accountId })
        .select({ __v: 0 })
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
});

router.get("/payments", (req, res) => {
    const accountId = req.params.id;
    return Payment.find({})
        .select({ __v: 0 })
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
});


module.exports = router;