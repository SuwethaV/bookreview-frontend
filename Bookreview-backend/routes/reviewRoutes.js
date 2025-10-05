const express = require("express");
const protect = require("../middleware/authMiddleware");
const { addReview } = require("../controllers/reviewController");

const router = express.Router();

router.post("/", protect, addReview);

module.exports = router;
