const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication");

const ticket = require("../controllers/ticket/verificationController");

// VERIFICATION
router.post("/ticket/verification", isAuthenticated, (req, res) => ticket.create(req, res));
router.get("/ticket/verification", (req, res) => ticket.all(req, res));
router.get("/ticket/verification/s/:id", (req, res) => ticket.getByAccountId(req, res));
router.put("/ticket/verification", (req, res) => ticket.updateProfileVerificationStatus(req, res));
router.delete("/ticket/verification/:id", (req, res) => ticket.deleteVerificationTicket(req, res));

module.exports = router;