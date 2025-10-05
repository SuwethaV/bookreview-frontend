import React, { useState } from 'react';
import { User, BookOpen, MessageSquare, Edit, Trash2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export function ProfilePage() {
  const { user, books, reviews, setCurrentPage, deleteBook } = useApp();
  const [activeTab, setActiveTab] = useState('books');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        <Button onClick={() => setCurrentPage('login')}>
          Log In
        </Button>
      </div>
    );
  }

  const userBooks = books.filter(book => book.createdBy === user.id);
  const userReviews = reviews.filter(review => review.userId === user.id);

  const handleDeleteBook = (bookId: string, bookTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      deleteBook(bookId);
      toast.success('Book deleted successfully');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-primary text-primary' : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const getBookTitleById = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <section 
        className="relative py-16 px-4 bg-gradient-to-br from-primary/10 to-primary/5"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.9), rgba(20, 184, 166, 0.8)), url('https://images.unsplash.com/photo-1755543832265-aa4a6b8c1414?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXJzJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NTk0OTU4NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <Avatar className="h-32 w-32 mx-auto ring-4 ring-white shadow-2xl">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-3xl bg-white text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-md shadow-xl">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">{user.name}</h1>
              <p className="text-gray-600 text-lg">{user.email}</p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{userBooks.length}</div>
                  <div className="text-sm font-medium text-gray-700">Books Added</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{userReviews.length}</div>
                  <div className="text-sm font-medium text-gray-700">Reviews Written</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {userReviews.length > 0 
                      ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <div className="text-sm font-medium text-gray-700">Avg Rating Given</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="books" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>My Books ({userBooks.length})</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>My Reviews ({userReviews.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="books" className="space-y-4">
              {userBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBooks.map((book, index) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
                            <img
                              src={book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                          >
                            {book.genre}
                          </Badge>
                        </div>
                        
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">{book.author}</p>
                            <p className="text-sm text-muted-foreground">{book.year}</p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {renderStars(book.averageRating)}
                              <span className="text-sm text-muted-foreground ml-1">
                                ({book.reviewCount})
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {book.averageRating.toFixed(1)}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {book.description}
                          </p>

                          <div className="flex space-x-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => setCurrentPage(`book-details-${book.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(`edit-book-${book.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBook(book.id, book.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-16">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No books added yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Share your favorite books with the community!
                    </p>
                    <Button onClick={() => setCurrentPage('add-book')}>
                      Add Your First Book
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {userReviews.length > 0 ? (
                <div className="space-y-4">
                  {userReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold mb-1">
                                {getBookTitleById(review.bookId)}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {renderStars(review.rating)}
                                <span className="text-sm text-muted-foreground ml-2">
                                  {review.rating}/5
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2"
                                onClick={() => setCurrentPage(`book-details-${review.bookId}`)}
                              >
                                View Book
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm leading-relaxed">
                            {review.text}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-16">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No reviews written yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start reviewing books to share your thoughts with others!
                    </p>
                    <Button onClick={() => setCurrentPage('home')}>
                      Browse Books
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </section>
    </div>
  );
}