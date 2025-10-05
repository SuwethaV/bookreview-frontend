import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  year: number;
  coverImage: string;
  createdBy: string;
  averageRating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  books: Book[];
  reviews: Review[];
  currentPage: string;
  searchQuery: string;
  selectedGenre: string;
  sortBy: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  addBook: (book: Omit<Book, 'id' | 'createdBy' | 'averageRating' | 'reviewCount'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>) => void;
  setCurrentPage: (page: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string) => void;
  setSortBy: (sort: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the summer of 1922 in the fictional town of West Egg on Long Island.',
    genre: 'Classic',
    year: 1925,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    createdBy: '1',
    averageRating: 4.2,
    reviewCount: 15
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    genre: 'Classic',
    year: 1960,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    createdBy: '1',
    averageRating: 4.5,
    reviewCount: 23
  },
  {
    id: '3',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'A science fiction epic about politics, religion, and power on the desert planet Arrakis.',
    genre: 'Science Fiction',
    year: 1965,
    coverImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop',
    createdBy: '1',
    averageRating: 4.8,
    reviewCount: 31
  },
  {
    id: '4',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever.',
    genre: 'Contemporary Fiction',
    year: 2020,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    createdBy: '1',
    averageRating: 4.1,
    reviewCount: 18
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones.',
    genre: 'Self-Help',
    year: 2018,
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
    createdBy: '1',
    averageRating: 4.6,
    reviewCount: 42
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    text: 'A beautiful exploration of the American Dream. Fitzgerald\'s prose is simply stunning.',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    bookId: '1',
    userId: '2',
    userName: 'Alice Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b25ec6b4?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'One of the greatest novels ever written. The symbolism and themes are masterfully crafted.',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    bookId: '3',
    userId: '1',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Mind-blowing world-building and complex political intrigue. A true sci-fi masterpiece.',
    createdAt: '2024-02-01'
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('title');

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('bookReviewUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('bookReviewUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('bookReviewUser');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Mock login logic - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const newUser: User = {
          id: '1',
          name: email.split('@')[0], // Use part of email as name
          email: email,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        };
        
        setUser(newUser);
        setCurrentPage('home'); // Redirect to home after login
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentPage('home');
    // Clear any user-specific data
    setSearchQuery('');
    setSelectedGenre('All');
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Mock signup logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (name && email && password) {
        const newUser: User = {
          id: Date.now().toString(), // Generate unique ID
          name: name,
          email: email,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        };
        
        setUser(newUser);
        setCurrentPage('home'); // Redirect to home after signup
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const addBook = (book: Omit<Book, 'id' | 'createdBy' | 'averageRating' | 'reviewCount'>) => {
    if (!user) {
      console.error('Cannot add book: No user logged in');
      return;
    }

    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      createdBy: user.id,
      averageRating: 0,
      reviewCount: 0
    };
    
    setBooks(prev => [newBook, ...prev]);
    setCurrentPage('home'); // Redirect to home after adding book
  };

  const updateBook = (id: string, updatedBook: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updatedBook } : book
    ));
  };

  const deleteBook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => prev.filter(book => book.id !== id));
      setReviews(prev => prev.filter(review => review.bookId !== id));
    }
  };

  const addReview = (review: Omit<Review, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt'>) => {
    if (!user) {
      console.error('Cannot add review: No user logged in');
      return;
    }
    
    const newReview: Review = {
      ...review,
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setReviews(prev => [newReview, ...prev]);
    
    // Update book's average rating and review count
    const bookReviews = [...reviews.filter(r => r.bookId === review.bookId), newReview];
    const averageRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
    
    updateBook(review.bookId, { 
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: bookReviews.length 
    });
  };

  const value: AppContextType = {
    user,
    books,
    reviews,
    currentPage,
    searchQuery,
    selectedGenre,
    sortBy,
    login,
    logout,
    signup,
    addBook,
    updateBook,
    deleteBook,
    addReview,
    setCurrentPage,
    setSearchQuery,
    setSelectedGenre,
    setSortBy
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}