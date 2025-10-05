const Review = require("../models/Review");
const Book = require("../models/Book");
const mongoose = require("mongoose"); // Add this import

// Add Review
// const addReview = async (req, res) => {
//   try {
//     const { bookId, rating, comment } = req.body;

//     // Validate if bookId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(bookId)) {
//       return res.status(400).json({ 
//         message: "Invalid book ID format" 
//       });
//     }

//     // Check if book exists
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({ 
//         message: "Book not found" 
//       });
//     }

//     // Create the review
//     const review = new Review({
//       book: bookId,
//       rating,
//       comment,
//       user: req.user._id // Assuming you have user info from auth middleware
//     });

//     // Save the review
//     const savedReview = await review.save();

//     // Update average rating - include the new review in calculation
//     const reviews = await Review.find({ book: bookId });
//     const totalRatings = reviews.reduce((sum, r) => sum + r.rating, 0);
//     const avgRating = totalRatings / reviews.length;
    
//     await Book.findByIdAndUpdate(bookId, { 
//       averageRating: avgRating.toFixed(1) 
//     });

//     res.status(201).json(savedReview);
//   } catch (error) {
//     console.error("Add review error details:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// In your review controller
const addReview = async (req, res) => {
  try {
    const { book, rating, comment } = req.body; // Changed from bookId to book
    
    console.log("Review submission data:", req.body);
    console.log("User making review:", req.user);

    // Validate required fields
    if (!book || !rating || !comment) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["book", "rating", "comment"] 
      });
    }

    const review = await Review.create({
      user: req.user._id,
      book: book, // This should match a book _id in your database
      rating,
      comment,
    });

    // Update average rating
    const reviews = await Review.find({ book: book });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Book.findByIdAndUpdate(book, { 
      averageRating: avgRating.toFixed(1),
      reviewCount: reviews.length 
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Add review error details:", error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = { addReview };