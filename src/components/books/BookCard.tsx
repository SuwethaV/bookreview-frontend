import React from 'react';
import { Star, User, Calendar, Eye } from 'lucide-react';
import { Book } from '../../context/AppContext';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { motion } from 'motion/react';

interface BookCardProps {
  book: Book;
  onViewDetails: (bookId: string) => void;
}

export function BookCard({ book, onViewDetails }: BookCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-primary text-primary'
            : i < rating
            ? 'fill-primary/50 text-primary'
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Card className="h-full overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary/50">
        <div className="relative">
          <motion.div
            className="aspect-[3/4] overflow-hidden bg-muted"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop';
              }}
            />
          </motion.div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {book.genre}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {book.title}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground space-x-2">
              <User className="h-3 w-3" />
              <span>{book.author}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground space-x-2">
              <Calendar className="h-3 w-3" />
              <span>{book.year}</span>
            </div>
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

          <p className="text-sm text-muted-foreground line-clamp-3">
            {book.description}
          </p>

          <Button
            variant="outline"
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            onClick={() => onViewDetails(book.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}