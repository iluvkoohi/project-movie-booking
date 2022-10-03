const express = require("express");
const router = express.Router();
const profile = require("../controllers/profile/profileController");
const { isAuthenticated } = require("../middleware/authentication");
const { check } = require('express-validator');

// PROFILE
router.post("/profile",
    isAuthenticated,
    [
        check('name.first', 'Firstname is required').notEmpty(),
        check('name.last', 'Lastname is required').notEmpty(),
        check('address.name', 'Address is required').notEmpty(),
        check('address.coordinates.latitude', 'Latitude is required').notEmpty(),
        check('address.coordinates.longitude', 'Longitude is required').notEmpty(),
        check('contact.email', 'Email is required').notEmpty(),
        check('contact.number', 'Number is required').notEmpty(),
        check('account.role', 'Role is required').notEmpty(),
    ], (req, res) => profile.createProfile(req, res));


router.get("/profile/s", isAuthenticated, (req, res) => profile.getProfile(req, res));
router.get("/profile/own", isAuthenticated, (req, res) => profile.getOwnProfile(req, res));
router.get("/profile/all", isAuthenticated, (req, res) => profile.getAllProfiles(req, res));

router.put("/profile",
    isAuthenticated,
    [
        check('name.first', 'Firstname is required').notEmpty(),
        check('name.last', 'Lastname is required').notEmpty(),
        check('contact.email', 'Email is required').notEmpty(),
        check('contact.number', 'Number is required').notEmpty(),
    ], (req, res) => profile.updateProfile(req, res));

router.put("/profile/address",
    isAuthenticated,
    [
        check('address.name', 'Address is required').notEmpty(),
        check('address.coordinates.latitude', 'Latitude is required').notEmpty(),
        check('address.coordinates.longitude', 'Longitude is required').notEmpty(),
    ], (req, res) => profile.updateProfileAddress(req, res));

router.put("/profile/avatar", isAuthenticated, (req, res) => profile.updateProfileAvatar(req, res));

router.put("/profile/visibility",
    isAuthenticated,
    [
        check('visibility', 'Visibility is required').notEmpty(),
    ], (req, res) => profile.updateProfileVisibility(req, res));

router.delete("/profile", isAuthenticated, (req, res) => profile.deleteProfile(req, res));

// GALLERY
router.put("/profile/gallery",
    isAuthenticated,
    [
        check('description', 'Description is required').notEmpty(),
    ], (req, res) => profile.updateProfileGallery(req, res));

router.put("/profile/gallery/remove",
    isAuthenticated,
    [
        check('_id', '_id is required').notEmpty(),
    ], (req, res) => profile.deleteInProfileGallery(req, res));

module.exports = router;
