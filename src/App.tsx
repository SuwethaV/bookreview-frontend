import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/books/HomePage';
import { BookDetailsPage } from './components/books/BookDetailsPage';
import { BookForm } from './components/books/BookForm';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ProfilePage } from './components/profile/ProfilePage';
import { Toaster } from './components/ui/sonner';
import { motion } from 'motion/react';

function AppContent() {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (true) {
      case currentPage === 'home':
        return <HomePage />;
      
      case currentPage === 'login':
        return <LoginPage />;
      
      case currentPage === 'signup':
        return <SignupPage />;
      
      case currentPage === 'add-book':
        return <BookForm mode="add" />;
      
      case currentPage.startsWith('edit-book-'):
        const editBookId = currentPage.replace('edit-book-', '');
        return <BookForm mode="edit" bookId={editBookId} />;
      
      case currentPage.startsWith('book-details-'):
        const bookId = currentPage.replace('book-details-', '');
        return <BookDetailsPage bookId={bookId} />;
      
      case currentPage === 'profile':
        return <ProfilePage />;
      
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!['login', 'signup'].includes(currentPage) && <Navigation />}
      
      <motion.main
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="relative flex-1"
      >
        {renderPage()}
      </motion.main>
      
      {!['login', 'signup'].includes(currentPage) && <Footer />}
      
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}