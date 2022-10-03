
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication");

const upload = require("../controllers/upload/uploadController");

router.post("/upload/img",
  isAuthenticated,
  (req, res) => upload.uploadImages(req, res));

module.exports = router;
