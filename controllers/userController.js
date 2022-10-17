require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { throwError } = require("../const/status");
const { validationResult } = require('express-validator');
const { userValidator } = require("../const/route_validators");

const User = require("../models/user");
const SALT_ROUNDS = 12;
const MAX_AGE = 2 * 60 * 60 * 1000;

router.post("/user/register", userValidator, async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());

        const { email, password } = req.body;

        const doesExist = await User.findOne({ email });
        if (doesExist) return res
            .status(400)
            .json({ message: "account already exist" });

        await bcrypt.hash(password, SALT_ROUNDS)
            .then(async (hashValue) => {
                new User({ email, hashValue })
                    .save()
                    .then((value) => {
                        const token = jwt.sign(
                            { data: value._id.toString() },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "1h" }
                        );
                        const cookieOptions = { httpOnly: true, maxAge: MAX_AGE };
                        return res.status(200)
                            //.cookie('token', token, cookieOptions)
                            .json({
                                accountId: value._id,
                                email,
                                password: hashValue,
                                token
                            });

                    })
                    .catch((err) => res.status(400).json(err));
            });
    } catch (error) {
        console.log(error);
    }
})

router.post("/user/login", userValidator, async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res
            .status(400)
            .json(errors.array());


        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return throwError(res, { message: "email and/or password is incorrect" });

        await bcrypt.compare(password, user.hashValue, function (err, result) {
            if (err) return throwError(res, { message: "email and/or password is incorrect" });
            if (!result) return throwError(res, { message: "email and/or password is incorrect" });

            const token = jwt.sign(
                { data: user._id.toString() },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1h" }
            );

            const cookieOptions = { httpOnly: true, maxAge: MAX_AGE };
            return res.status(200)
                // .cookie('token', token, cookieOptions)
                .json({
                    "accountId": user._id,
                    "email": user.email,
                    "password": user.hashValue,
                    token
                });
        })

    } catch (error) {
        console.log(error);
    }
});

router.get("/user/:accountId", (req, res) => {
    const accountId = req.params.accountId;
    return User.findOne({ accountId })
        .then((value) => {
            if (!value) return res.status(400).json({ message: "Profile not found" })
            return res.status(200).json(value);
        })
        .catch((err) => res.status(400).json(err));
});

router.get("/user", (req, res) => {
    return User.find({})
        .then((value) => res.status(200).json(value))
        .catch((err) => res.status(400).json(err));
});


router.put("/user", async (req, res) => {
    const { accountId, businessPermit, verified } = req.body;

    return User.findOneAndUpdate(
        { accountId },
        {
            $set: {
                businessPermit,
                verified,
                "date.updatedAt": Date.now(),
            },
        },
        { new: true })
        .then((value) => {
            if (!value) return res.status(400).json(err)
            return res.status(200).json(value);
        })
        .catch((err) => res.status(400).json(err));

})
const changePassword = async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return throwError(res, errors.array());

        const { email, password, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return throwError(res, { message: "email and/or password is incorrect" });

        await bcrypt.compare(password, user.hashValue, async function (err, result) {
            if (err) return throwError(res, { message: "email and/or password is incorrect" });
            if (!result) return throwError(res, { message: "email and/or password is incorrect" });

            const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
            const query = { email };
            const update = { hashValue: hash };
            const options = { new: true }
            return User.findOneAndUpdate(query, update, options)
                .then(value => res.status(200).json(value))
                .catch((err) => throwError(res, err));
        });


    } catch (error) {
        console.log(error);
    }
}

module.exports = router;

