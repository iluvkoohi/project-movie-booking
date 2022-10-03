const mongoose = require('mongoose');
const Art = require("../../models/art");
const Billing = require("../../models/billing");
const TxnMonetization = require("../../models/monetization");
const { Profile } = require("../../models/profile");
const { validationResult } = require('express-validator');
const { throwError } = require("../../const/status");
const { v4: uuidv4 } = require('uuid');

const MONETIZATION_PERCENT = 0.12;

const art = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return throwError(res, errors.array());

        const transactionId = uuidv4();
        const { customerAccountId, artistAccountId, _artId } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(customerAccountId) ||
            !mongoose.Types.ObjectId.isValid(artistAccountId) ||
            !mongoose.Types.ObjectId.isValid(_artId))
            return throwError(res, { message: "some id pattern is invalid" });

        Art.findById(_artId)
            .then(async (value) => {

                if (value == null)
                    return throwError(res, { message: "Artwork not found" });

                const { _id, title, description, price, availability, date, buyer } = value;

                const monetizationAmt = parseInt(value.price) * MONETIZATION_PERCENT;
                const exclude = { _id: 0, __v: 0, address: 0, date: 0, contact: 0, gallery: 0, account: 0 };

                if (!availability)
                    return throwError(res, {
                        message: `The Artwork was sold on ${date.updatedAt} by ${Object.fromEntries(buyer.name).first}`
                    });

                const customerProfile = await Profile
                    .findOne({ accountId: customerAccountId, 'account.role': 'customer' })
                    .select(exclude);

                const artistProfile = await Profile
                    .findOne({ accountId: artistAccountId, 'account.role': 'artist' })
                    .select(exclude);

                if (customerProfile == null || artistProfile == null)
                    return throwError(res, { message: "Profile not found" });


                const update = await Art.findByIdAndUpdate(_artId, {
                    $set: {
                        availability: false,
                        buyer: {
                            transactionId,
                            price,
                            name: customerProfile.name,
                        },
                        "date.updatedAt": Date.now(),
                    },
                }, { new: true })

                const monetization = await TxnMonetization({
                    transactionId,
                    amount: monetizationAmt
                }).save();

                const billing = await Billing({
                    transactionId,
                    header: {
                        "customer": {
                            accountId: customerProfile.accountId,
                            name: customerProfile.name,
                            avatar: customerProfile.avatar
                        },
                        "artist": {
                            accountId: artistProfile.accountId,
                            name: artistProfile.name,
                            avatar: artistProfile.avatar
                        }
                    },
                    art: { _id, title, description, price }
                }).save();

                return res.status(200).json({
                    update,
                    monetization,
                    billing
                })
            })

    } catch (error) {
        return throwError(res, error);
    }
}

const getAll = (req, res) => {
    try {
        return Billing.find({})
            .sort({ "date.createdAt": "desc" }) // filter by date
            .select({ __v: 0, _id: 0 }) // Do not return _id and __v
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
}

const getByCustomers = (req, res) => {
    try {
        const accountId = req.params.id;
        return Billing.find({ "header.customer.accountId": accountId })
            .sort({ "date.createdAt": "desc" }) // filter by date
            .select({ __v: 0, _id: 0 }) // Do not return _id and __v
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
}

const getByArtist = (req, res) => {
    try {
        const accountId = req.params.id;
        return Billing.find({ "header.artist.accountId": accountId })
            .sort({ "date.createdAt": "desc" }) // filter by date
            .select({ __v: 0, _id: 0 }) // Do not return _id and __v
            .then((value) => res.status(200).json(value))
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
}

const getByTxnId = (req, res) => {
    try {
        const transactionId = req.params.id;
        return Billing.findOne({ transactionId })
            .select({ __v: 0, _id: 0 }) // Do not return _id and __v
            .then((value) => {
                if (!value) return throwError(res, { message: "Billing not found" });
                return res.status(200).json(value);
            })
            .catch((err) => res.status(400).json(err));
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    art,
    getByCustomers,
    getByArtist,
    getAll,
    getByTxnId
}