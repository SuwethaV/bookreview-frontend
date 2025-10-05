import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Plus, BookOpen } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCard } from './BookCard';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { motion } from 'motion/react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import API from "../../api/axiosInstance";

export function HomePage() {
  const { 
    books, 
    user, 
    searchQuery, 
    setSearchQuery, 
    selectedGenre, 
    setSelectedGenre, 
    sortBy, 
    setSortBy, 
    setCurrentPage 
  } = useApp();

  const [currentBookPage, setCurrentBookPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const booksPerPage = 6;

  // Use books from context (which should be populated from your AppContext)
  // If you want to fetch from API, you need to update the context
  const displayedBooks = books;

  const genres = ['All', ...Array.from(new Set(displayedBooks.map(book => book.genre)))];

  const filteredAndSortedBooks = useMemo(() => {
    let filtered = displayedBooks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre && selectedGenre !== 'All') {
      filtered = filtered.filter(book => book.genre === selectedGenre);
    }

    // Sort books
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.author.localeCompare(b.author);
        case 'year':
          return b.year - a.year;
        case 'rating':
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [displayedBooks, searchQuery, selectedGenre, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedBooks.length / booksPerPage);
  const startIndex = (currentBookPage - 1) * booksPerPage;
  const paginatedBooks = filteredAndSortedBooks.slice(startIndex, startIndex + booksPerPage);

  const handleViewDetails = (bookId: string) => {
    setCurrentPage(`book-details-${bookId}`);
  };

  // If you want to fetch books from API on component mount, uncomment this:
  /*
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const { data } = await API.get('/books');
        // You would need to update your context here with the fetched books
        console.log('Fetched books:', data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);
  */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 to-primary/5"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.8), rgba(20, 184, 166, 0.6)), url('https://images.unsplash.com/photo-1725582205484-77377dad63b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZWFkaW5nJTIwYm9va3N8ZW58MXx8fHwxNzU5NTUwODk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Your Next
              <span className="block text-yellow-200">Great Read</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join our community of book lovers. Share reviews, discover new authors, and find your next favorite book.
            </p>
            
            {/* Hero Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search for books, authors, or genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 shadow-lg"
              />
            </div>

            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => setCurrentPage('add-book')}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your Book
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search books or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="author">Sort by Author</SelectItem>
                <SelectItem value="year">Sort by Year</SelectItem>
                <SelectItem value="rating">Sort by Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchQuery || (selectedGenre && selectedGenre !== 'All')) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedGenre && selectedGenre !== 'All' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Genre: {selectedGenre}
                  <button
                    onClick={() => setSelectedGenre('All')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredAndSortedBooks.length} book{filteredAndSortedBooks.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Books Grid */}
          {paginatedBooks.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {paginatedBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <BookCard book={book} onViewDetails={handleViewDetails} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedGenre !== 'All'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to add a book to our collection!'
                }
              </p>
              {user && (
                <Button onClick={() => setCurrentPage('add-book')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add a Book
                </Button>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentBookPage > 1) setCurrentBookPage(currentBookPage - 1);
                      }}
                      className={currentBookPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentBookPage(page);
                        }}
                        isActive={currentBookPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentBookPage < totalPages) setCurrentBookPage(currentBookPage + 1);
                      }}
                      className={currentBookPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}