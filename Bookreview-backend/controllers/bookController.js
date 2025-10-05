const Book = require("../models/Book");
const Review = require("../models/Review");

// Create Book
const createBook = async (req, res) => {
  try {
    const { title, author, description, coverImage } = req.body;
    const book = await Book.create({
      title,
      author,
      description,
      coverImage,
      createdBy: req.user._id,
    });
    res.status(201).json(book);
  } catch (error) {
    console.error("Get book error details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Books (with pagination)
const getBooks = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  try {
    const books = await Book.find().skip(skip).limit(limit);
    const count = await Book.countDocuments();
    res.json({ books, totalPages: Math.ceil(count / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Book
// const getBookById = async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id).populate("createdBy", "name");
//     if (!book) return res.status(404).json({ message: "Book not found" });

//     const reviews = await Review.find({ book: book._id }).populate("user", "name");
//     res.json({ ...book._doc, reviews });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get single Book - FIXED VERSION
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviews = await Review.find({ book: book._id });
    
    // Return a clean response without spreading Mongoose document
    res.json({
      _id: book._id,
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre,
      year: book.year,
      coverImage: book.coverImage,
      averageRating: book.averageRating,
      reviewCount: book.reviewCount,
      createdBy: book.createdBy,
      reviews: reviews
    });
  } catch (error) {
    console.error("Get book by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Update Book
const updateBook = async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    console.error("Add review error details:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Book
const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
