// routes/bookRoutes.js
const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

router.route("/")
  .post(protect, createBook)
  .get(getBooks);

router.route("/:id")
  .get(getBookById)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

module.exports = router;
