// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Star, User, Calendar, Edit, Trash2, MessageSquare } from 'lucide-react';
// import { useApp } from '../../context/AppContext';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Textarea } from '../ui/textarea';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { motion } from 'motion/react';
// import { toast } from 'sonner';
// import API from "../../api/axiosInstance";

// interface BookDetailsPageProps {
//   bookId: string;
// }

// interface Book {
//   id: string;
//   title: string;
//   author: string;
//   description: string;
//   genre: string;
//   year: number;
//   coverImage: string;
//   averageRating: number;
//   reviewCount: number;
//   createdBy: string;
// }

// interface Review {
//   id: string;
//   bookId: string;
//   userId: string;
//   userName: string;
//   userAvatar: string;
//   rating: number;
//   text: string;
//   createdAt: string;
// }

// export function BookDetailsPage({ bookId }: BookDetailsPageProps) {
//   const { books, reviews, user, setCurrentPage, deleteBook, addReview } = useApp();
//   const [book, setBook] = useState<Book | null>(null);
//   const [newReview, setNewReview] = useState({ rating: 5, text: '' });
//   const [isSubmittingReview, setIsSubmittingReview] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fetch book details from API
//   useEffect(() => {
//     const fetchBookDetails = async () => {
//       try {
//         setIsLoading(true);
//         const { data } = await API.get(`/books/${bookId}`);
//         setBook(data);
//       } catch (error) {
//         console.error('Error fetching book details:', error);
//         toast.error('Failed to load book details');
        
//         // Fallback to context data if API fails
//         const contextBook = books.find(b => b.id === bookId);
//         if (contextBook) {
//           setBook(contextBook);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBookDetails();
//   }, [bookId, books]);

//   const bookReviews = reviews.filter(r => r.bookId === bookId);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p>Loading book details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!book) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <h2 className="text-2xl font-bold mb-4">Book not found</h2>
//         <Button onClick={() => setCurrentPage('home')}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Home
//         </Button>
//       </div>
//     );
//   }

//   const isOwner = user?.id === book.createdBy;

//   const handleDeleteBook = () => {
//     if (window.confirm('Are you sure you want to delete this book?')) {
//       deleteBook(book.id);
//       toast.success('Book deleted successfully');
//       setCurrentPage('home');
//     }
//   };

//   const handleSubmitReview = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       setCurrentPage('login');
//       return;
//     }

//     if (!newReview.text.trim()) {
//       toast.error('Please write a review');
//       return;
//     }

//     setIsSubmittingReview(true);
    
//     try {
//       await API.post("/reviews", {
//         bookId: book.id,
//         rating: newReview.rating,
//         comment: newReview.text.trim(),
//       });

//       // Add review to context
//       addReview({
//         id: Date.now().toString(),
//         bookId: book.id,
//         userId: user.id,
//         userName: user.name || user.email,
//         userAvatar: user.avatar || '',
//         rating: newReview.rating,
//         text: newReview.text.trim(),
//         createdAt: new Date().toISOString(),
//       });

//       setNewReview({ rating: 5, text: '' });
//       toast.success("Review added successfully!");
//     } catch (error) {
//       toast.error("Failed to add review");
//     } finally {
//       setIsSubmittingReview(false);
//     }
//   };

//   const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
//     return Array.from({ length: 5 }, (_, i) => (
//       <Star
//         key={i}
//         className={`h-5 w-5 cursor-pointer transition-colors ${
//           i < rating
//             ? 'fill-primary text-primary'
//             : 'text-muted-foreground hover:text-primary'
//         }`}
//         onClick={() => interactive && onRatingChange?.(i + 1)}
//       />
//     ));
//   };

//   const getRatingDistribution = () => {
//     const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//     bookReviews.forEach(review => {
//       distribution[review.rating as keyof typeof distribution]++;
//     });
//     return distribution;
//   };

//   const ratingDistribution = getRatingDistribution();

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}
//       <section 
//         className="relative py-16 px-4"
//         style={{
//           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${book.coverImage}')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center'
//         }}
//       >
//         <div className="container mx-auto max-w-6xl">
//           <Button
//             variant="ghost"
//             className="mb-6 text-white hover:bg-white/10"
//             onClick={() => setCurrentPage('home')}
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Books
//           </Button>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-8"
//           >
//             <div className="md:col-span-1">
//               <motion.img
//                 src={book.coverImage}
//                 alt={book.title}
//                 className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.3 }}
//               />
//             </div>
            
//             <div className="md:col-span-2 text-white space-y-4">
//               <div>
//                 <Badge variant="secondary" className="mb-2">
//                   {book.genre}
//                 </Badge>
//                 <h1 className="text-4xl md:text-5xl font-bold mb-2">{book.title}</h1>
//                 <div className="flex items-center space-x-4 text-lg text-white/90">
//                   <div className="flex items-center space-x-1">
//                     <User className="h-5 w-5" />
//                     <span>{book.author}</span>
//                   </div>
//                   <div className="flex items-center space-x-1">
//                     <Calendar className="h-5 w-5" />
//                     <span>{book.year}</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-1">
//                   {renderStars(book.averageRating)}
//                 </div>
//                 <span className="text-xl font-semibold">
//                   {book.averageRating.toFixed(1)}
//                 </span>
//                 <span className="text-white/70">
//                   ({book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''})
//                 </span>
//               </div>

//               <p className="text-lg text-white/90 leading-relaxed">
//                 {book.description}
//               </p>

//               {isOwner && (
//                 <div className="flex space-x-3">
//                   <Button 
//                     variant="secondary"
//                     onClick={() => setCurrentPage(`edit-book-${book.id}`)}
//                   >
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit Book
//                   </Button>
//                   <Button 
//                     variant="destructive"
//                     onClick={handleDeleteBook}
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete Book
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Reviews Section */}
//       <section className="container mx-auto px-4 py-8 max-w-6xl">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Rating Overview */}
//           <div className="lg:col-span-1">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-2">
//                   <MessageSquare className="h-5 w-5" />
//                   <span>Ratings Overview</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-primary">
//                     {book.averageRating.toFixed(1)}
//                   </div>
//                   <div className="flex items-center justify-center space-x-1 mt-1">
//                     {renderStars(book.averageRating)}
//                   </div>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Based on {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   {[5, 4, 3, 2, 1].map(rating => {
//                     const count = ratingDistribution[rating as keyof typeof ratingDistribution];
//                     const percentage = book.reviewCount > 0 ? (count / book.reviewCount) * 100 : 0;
                    
//                     return (
//                       <div key={rating} className="flex items-center space-x-2 text-sm">
//                         <span className="w-8">{rating}</span>
//                         <Star className="h-4 w-4 fill-primary text-primary" />
//                         <div className="flex-1 bg-muted rounded-full h-2">
//                           <div
//                             className="bg-primary h-2 rounded-full transition-all duration-500"
//                             style={{ width: `${percentage}%` }}
//                           />
//                         </div>
//                         <span className="w-8 text-right">{count}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Reviews List and Add Review */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Add Review Form */}
//             {user ? (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Write a Review</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSubmitReview} className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Rating</label>
//                       <div className="flex items-center space-x-1">
//                         {renderStars(newReview.rating, true, (rating) => 
//                           setNewReview(prev => ({ ...prev, rating }))
//                         )}
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="block text-sm font-medium mb-2">Review</label>
//                       <Textarea
//                         placeholder="Share your thoughts about this book..."
//                         value={newReview.text}
//                         onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
//                         rows={4}
//                         disabled={isSubmittingReview}
//                       />
//                     </div>
                    
//                     <Button type="submit" disabled={isSubmittingReview}>
//                       {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             ) : (
//               <Card>
//                 <CardContent className="text-center py-8">
//                   <p className="text-muted-foreground mb-4">
//                     Please log in to write a review
//                   </p>
//                   <Button onClick={() => setCurrentPage('login')}>
//                     Log In
//                   </Button>
//                 </CardContent>
//               </Card>
//             )}

//             {/* Reviews List */}
//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold">
//                 Reviews ({bookReviews.length})
//               </h3>
              
//               {bookReviews.length > 0 ? (
//                 <div className="space-y-4">
//                   {bookReviews.map((review, index) => (
//                     <motion.div
//                       key={review.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.3, delay: index * 0.1 }}
//                     >
//                       <Card>
//                         <CardContent className="pt-6">
//                           <div className="flex items-start space-x-4">
//                             <Avatar>
//                               <AvatarImage src={review.userAvatar} alt={review.userName} />
//                               <AvatarFallback>
//                                 {review.userName.charAt(0)}
//                               </AvatarFallback>
//                             </Avatar>
                            
//                             <div className="flex-1 space-y-2">
//                               <div className="flex items-center justify-between">
//                                 <div>
//                                   <h4 className="font-semibold">{review.userName}</h4>
//                                   <div className="flex items-center space-x-1 mt-1">
//                                     {renderStars(review.rating)}
//                                   </div>
//                                 </div>
//                                 <span className="text-sm text-muted-foreground">
//                                   {new Date(review.createdAt).toLocaleDateString()}
//                                 </span>
//                               </div>
                              
//                               <p className="text-sm leading-relaxed">
//                                 {review.text}
//                               </p>
//                             </div>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </motion.div>
//                   ))}
//                 </div>
//               ) : (
//                 <Card>
//                   <CardContent className="text-center py-8">
//                     <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     <h4 className="font-semibold mb-2">No reviews yet</h4>
//                     <p className="text-muted-foreground">
//                       Be the first to share your thoughts about this book!
//                     </p>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, User, Calendar, Edit, Trash2, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import API from "../../api/axiosInstance";

interface BookDetailsPageProps {
  bookId: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  year: number;
  coverImage: string;
  averageRating: number;
  reviewCount: number;
  createdBy: string;
}

interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  text: string;
  createdAt: string;
}

export function BookDetailsPage({ bookId }: BookDetailsPageProps) {
  const { books, reviews, user, setCurrentPage, deleteBook, addReview } = useApp();
  const [book, setBook] = useState<Book | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user || !!localStorage.getItem('token');

  // Fetch book details from API
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        const { data } = await API.get(`/books/${bookId}`);
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
        toast.error('Failed to load book details');
        
        // Fallback to context data if API fails
        const contextBook = books.find(b => b.id === bookId);
        if (contextBook) {
          setBook(contextBook);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId, books]);

  const bookReviews = reviews.filter(r => r.bookId === bookId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Book not found</h2>
        <Button onClick={() => setCurrentPage('home')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === book.createdBy;

  const handleDeleteBook = () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook(book.id);
      toast.success('Book deleted successfully');
      setCurrentPage('home');
    }
  };

const handleSubmitReview = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!isAuthenticated) {
    toast.error('Please log in to write a review');
    setCurrentPage('login');
    return;
  }

  if (!newReview.text.trim()) {
    toast.error('Please write a review');
    return;
  }

  setIsSubmittingReview(true);
  
  try {
    const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
    
    // FIX: Use book.id instead of books.id
    const response = await API.post("/reviews", {
      book: book.id, // ✅ CORRECTED: Use the actual book's ID
      rating: newReview.rating,
      comment: newReview.text.trim(),
    });

    // FIX: Also update the context with the correct book ID
    addReview({
      id: response.data._id || Date.now().toString(),
      bookId: book.id, // ✅ CORRECTED
      userId: currentUser.id || 'unknown',
      userName: currentUser.name || currentUser.email || 'Anonymous',
      userAvatar: currentUser.avatar || '',
      rating: newReview.rating,
      text: newReview.text.trim(),
      createdAt: new Date().toISOString(),
    });

    setNewReview({ rating: 5, text: '' });
    toast.success("Review added successfully!");
  } catch (error: any) {
    console.error('Review submission error details:', error);
    
    if (error.response?.data) {
      console.error('Server error response:', error.response.data);
    }
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      setCurrentPage('login');
    } else {
      toast.error(error.response?.data?.message || "Failed to add review");
    }
  } finally {
    setIsSubmittingReview(false);
  }
};

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 cursor-pointer transition-colors ${
          i < rating
            ? 'fill-primary text-primary'
            : 'text-muted-foreground hover:text-primary'
        }`}
        onClick={() => interactive && onRatingChange?.(i + 1)}
      />
    ));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    bookReviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative py-16 px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${book.coverImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto max-w-6xl">
          <Button
            variant="ghost"
            className="mb-6 text-white hover:bg-white/10"
            onClick={() => setCurrentPage('home')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-1">
              <motion.img
                src={book.coverImage}
                alt={book.title}
                className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <div className="md:col-span-2 text-white space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {book.genre}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{book.title}</h1>
                <div className="flex items-center space-x-4 text-lg text-white/90">
                  <div className="flex items-center space-x-1">
                    <User className="h-5 w-5" />
                    <span>{book.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-5 w-5" />
                    <span>{book.year}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {renderStars(book.averageRating)}
                </div>
                <span className="text-xl font-semibold">
                  {book.averageRating.toFixed(1)}
                </span>
                <span className="text-white/70">
                  ({book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''})
                </span>
              </div>

              <p className="text-lg text-white/90 leading-relaxed">
                {book.description}
              </p>

              {isOwner && (
                <div className="flex space-x-3">
                  <Button 
                    variant="secondary"
                    onClick={() => setCurrentPage(`edit-book-${book.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Book
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleDeleteBook}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Book
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Ratings Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {book.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    {renderStars(book.averageRating)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                    const percentage = book.reviewCount > 0 ? (count / book.reviewCount) * 100 : 0;
                    
                    return (
                      <div key={rating} className="flex items-center space-x-2 text-sm">
                        <span className="w-8">{rating}</span>
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews List and Add Review */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Review Form */}
            {isAuthenticated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex items-center space-x-1">
                        {renderStars(newReview.rating, true, (rating) => 
                          setNewReview(prev => ({ ...prev, rating }))
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Review</label>
                      <Textarea
                        placeholder="Share your thoughts about this book..."
                        value={newReview.text}
                        onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                        rows={4}
                        disabled={isSubmittingReview}
                      />
                    </div>
                    
                    <Button type="submit" disabled={isSubmittingReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Please log in to write a review
                  </p>
                  <Button onClick={() => setCurrentPage('login')}>
                    Log In
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Reviews ({bookReviews.length})
              </h3>
              
              {bookReviews.length > 0 ? (
                <div className="space-y-4">
                  {bookReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.userAvatar} alt={review.userName} />
                              <AvatarFallback>
                                {review.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-semibold">{review.userName}</h4>
                                  <div className="flex items-center space-x-1 mt-1">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              
                              <p className="text-sm leading-relaxed">
                                {review.text}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">No reviews yet</h4>
                    <p className="text-muted-foreground">
                      Be the first to share your thoughts about this book!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}