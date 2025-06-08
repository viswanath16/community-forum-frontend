'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { categoriesAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        
        // Limit to 6 categories for homepage and ensure we have valid data
        const validCategories = categoriesArray
          .filter(cat => cat && cat.id && cat.name)
          .slice(0, 6);
        
        setCategories(validCategories);
      } catch (err: any) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories from the server.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error} Please check your internet connection and try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center p-6">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No categories available</h3>
        <p className="text-muted-foreground">
          Categories will appear here once they are created by administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Card className="hover:shadow-md transition-shadow h-full cursor-pointer group">
            <CardHeader className="pb-2">
              <CardTitle className="group-hover:text-primary transition-colors">
                {category.name}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {category.description || 'No description available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {category.threadCount || 0} {(category.threadCount || 0) === 1 ? 'thread' : 'threads'}
                  </Badge>
                  {category.postCount !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                    </Badge>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}