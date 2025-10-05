import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Book } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import API from "../../api/axiosInstance";

interface BookFormProps {
  bookId?: string;
  mode: 'add' | 'edit';
}

export function BookForm({ bookId, mode }: BookFormProps) {
  const { books, addBook, updateBook, setCurrentPage } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    year: new Date().getFullYear(),
    coverImage: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const existingBook = bookId ? books.find(b => b.id === bookId) : null;
const handleSubmit = async () => {
  await API.post("/books", { title, author, description, coverImage });
};
  useEffect(() => {
    if (mode === 'edit' && existingBook) {
      setFormData({
        title: existingBook.title,
        author: existingBook.author,
        description: existingBook.description,
        genre: existingBook.genre,
        year: existingBook.year,
        coverImage: existingBook.coverImage
      });
      setCoverImagePreview(existingBook.coverImage);
    }
  }, [mode, existingBook]);

  const genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Thriller',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Classic',
    'Contemporary Fiction',
    'Young Adult'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, coverImage: url }));
    setCoverImagePreview(url);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    if (formData.year < 1000 || formData.year > new Date().getFullYear() + 10) {
      newErrors.year = 'Please enter a valid year';
    }

    if (!formData.coverImage.trim()) {
      newErrors.coverImage = 'Cover image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  

  const generateRandomCoverImage = () => {
    const bookImageUrls = [
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1526243741027-444d633d7365?w=300&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop'
    ];
    
    const randomUrl = bookImageUrls[Math.floor(Math.random() * bookImageUrls.length)];
    handleImageUrlChange(randomUrl);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setCurrentPage('home')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-6 w-6" />
                <span>{mode === 'add' ? 'Add New Book' : 'Edit Book'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cover Image Section */}
                  <div className="space-y-4">
                    <Label>Cover Image</Label>
                    <div className="space-y-4">
                      {coverImagePreview ? (
                        <motion.div
                          className="aspect-[3/4] bg-muted rounded-lg overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={coverImagePreview}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                            onError={() => setCoverImagePreview('')}
                          />
                        </motion.div>
                      ) : (
                        <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                            <p className="text-sm text-muted-foreground">Cover Image Preview</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Input
                          placeholder="Enter image URL"
                          value={formData.coverImage}
                          onChange={(e) => handleImageUrlChange(e.target.value)}
                          className={errors.coverImage ? 'border-destructive' : ''}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={generateRandomCoverImage}
                        >
                          Generate Random Cover
                        </Button>
                      </div>
                      
                      {errors.coverImage && (
                        <p className="text-sm text-destructive">{errors.coverImage}</p>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter book title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className={errors.title ? 'border-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.title && (
                          <p className="text-sm text-destructive">{errors.title}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author">Author *</Label>
                        <Input
                          id="author"
                          placeholder="Enter author name"
                          value={formData.author}
                          onChange={(e) => handleInputChange('author', e.target.value)}
                          className={errors.author ? 'border-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.author && (
                          <p className="text-sm text-destructive">{errors.author}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="genre">Genre *</Label>
                        <Select
                          value={formData.genre}
                          onValueChange={(value) => handleInputChange('genre', value)}
                          disabled={isLoading}
                        >
                          <SelectTrigger className={errors.genre ? 'border-destructive' : ''}>
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map(genre => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.genre && (
                          <p className="text-sm text-destructive">{errors.genre}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Publication Year *</Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="Enter publication year"
                          value={formData.year}
                          onChange={(e) => handleInputChange('year', parseInt(e.target.value) || '')}
                          className={errors.year ? 'border-destructive' : ''}
                          disabled={isLoading}
                        />
                        {errors.year && (
                          <p className="text-sm text-destructive">{errors.year}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter book description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className={`min-h-32 ${errors.description ? 'border-destructive' : ''}`}
                        disabled={isLoading}
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive">{errors.description}</p>
                      )}
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button type="submit" disabled={isLoading} className="flex-1">
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 border-2 border-background border-t-transparent rounded-full mr-2"
                          />
                        ) : null}
                        {mode === 'add' ? 'Add Book' : 'Update Book'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentPage('home')}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}