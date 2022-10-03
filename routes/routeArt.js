const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication");
const { check } = require('express-validator');

const art = require("../controllers/art/artController");
const purchase = require("../controllers/art/artPurchaseController");

const artValidator = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    // check('address', 'Address is required').notEmpty(),
    // check('latitude', 'Latitude is required').notEmpty(),
    // check('longitude', 'Longitude is required').notEmpty(),
];

const updateArtImagesValidator = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
];

const updateArtValidator = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('availability', 'Availability is required').notEmpty(),
];
const VALIDATOR_PURCHASE = [
    check('customerAccountId', 'Customer accountId is required').notEmpty(),
    check('artistAccountId', 'Artist accountId is required').notEmpty(),
    check('_artId', 'Art Id is required').notEmpty(),
];

router.post("/art",
    isAuthenticated,
    artValidator,
    (req, res) => art.create(req, res));

router.get("/arts",
    isAuthenticated,
    (req, res) => art.getAllArts(req, res));

router.get("/arts/by-artists",
    isAuthenticated,
    (req, res) => art.getAllArtsByArtist(req, res));

router.get("/art/s/:id",
    isAuthenticated,
    (req, res) => art.getById(req, res));

router.put("/art/update",
    isAuthenticated,
    updateArtValidator,
    (req, res) => art.updateArt(req, res));

router.put("/art/update/image",
    isAuthenticated,
    updateArtImagesValidator,
    (req, res) => art.updateArtImages(req, res));

router.delete("/art",
    isAuthenticated,
    (req, res) => art.remove(req, res));


// PURCHASE
router.post("/art/purchase",
    isAuthenticated,
    VALIDATOR_PURCHASE,
    (req, res) => purchase.art(req, res));


router.get("/art/purchase/s/:id",
    isAuthenticated,
    (req, res) => purchase.getByTxnId(req, res));

router.get("/art/purchase/all",
    isAuthenticated,
    (req, res) => purchase.getAll(req, res));

router.get("/art/purchase/customer/:id",
    isAuthenticated,
    (req, res) => purchase.getByCustomers(req, res));

router.get("/art/purchase/artist/:id",
    isAuthenticated,
    (req, res) => purchase.getByArtist(req, res));

module.exports = router;