'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await categoriesAPI.getAll();
      console.log('Categories API response:', data);
      
      // Handle different response formats from the API
      let categoriesArray: Category[] = [];
      
      if (Array.isArray(data)) {
        categoriesArray = data;
      } else if (data && Array.isArray(data.categories)) {
        categoriesArray = data.categories;
      } else if (data && Array.isArray(data.data)) {
        categoriesArray = data.data;
      } else if (data && data.success && Array.isArray(data.data)) {
        categoriesArray = data.data;
      } else {
        console.warn('Unexpected categories data format:', data);
        categoriesArray = [];
      }
      
      // Filter out invalid categories and ensure we have valid data
      const validCategories = categoriesArray.filter(cat => cat && cat.id && cat.name);
      
      setCategories(validCategories);
    } catch (err: any) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories from the server. Please check your internet connection.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-7 w-40 mb-1" />
                <Skeleton className="h-4 w-full max-w-2xl" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <MessageSquare className="mr-2 h-7 w-7" />
            Forum Categories
          </h1>
          <p className="text-muted-foreground">
            Browse all discussion categories and find topics that interest you.
          </p>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadCategories}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Group categories by parent/child relationship
  const parentCategories = categories.filter(category => !category.parentId);
  const childCategories = categories.filter(category => category.parentId);
  
  // Add subcategories to each parent
  parentCategories.forEach(parent => {
    parent.subcategories = childCategories.filter(child => child.parentId === parent.id);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <MessageSquare className="mr-2 h-7 w-7" />
          Forum Categories
        </h1>
        <p className="text-muted-foreground">
          Browse all discussion categories and find topics that interest you.
        </p>
        {categories.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing {categories.length} categories from the backend API
          </p>
        )}
      </div>
      
      {parentCategories.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No categories available</h3>
          <p className="text-muted-foreground mb-4">
            Categories will appear here once they are created by administrators.
          </p>
          <Button onClick={loadCategories} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Categories
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {parentCategories.map((category) => (
            <div key={category.id}>
              <Link href={`/categories/${category.slug}`}>
                <Card className="hover:shadow-md transition-shadow mb-4 cursor-pointer group">
                  <CardHeader className="pb-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription>
                      {category.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <Badge variant="secondary">
                          {category.threadCount || 0} {(category.threadCount || 0) === 1 ? 'thread' : 'threads'}
                        </Badge>
                        <Badge variant="outline">
                          {category.postCount || 0} {(category.postCount || 0) === 1 ? 'post' : 'posts'}
                        </Badge>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="ml-8 space-y-4 mt-4 mb-6">
                  {category.subcategories.map((subcategory) => (
                    <Link key={subcategory.id} href={`/categories/${subcategory.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary group">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {subcategory.name}
                          </CardTitle>
                          <CardDescription>
                            {subcategory.description || 'No description available'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div className="flex space-x-4">
                              <Badge variant="secondary">
                                {subcategory.threadCount || 0} {(subcategory.threadCount || 0) === 1 ? 'thread' : 'threads'}
                              </Badge>
                              <Badge variant="outline">
                                {subcategory.postCount || 0} {(subcategory.postCount || 0) === 1 ? 'post' : 'posts'}
                              </Badge>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}