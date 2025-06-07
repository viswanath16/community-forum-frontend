'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { fetchCategories } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, MessageSquare } from 'lucide-react';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        console.log('Categories loaded:', data); // Debug log
        
        // Ensure we have an array and limit to 6 categories for homepage
        const categoriesArray = Array.isArray(data) ? data : [];
        setCategories(categoriesArray.slice(0, 6));
        setError(null);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories. Please try again later.');
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
      <div className="text-center p-6">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center p-6">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/categories/${category.slug}`}>
          <Card className="hover:shadow-md transition-shadow h-full cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle>{category.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-2">
                <Badge variant="secondary">
                  {category.threadCount || 0} {(category.threadCount || 0) === 1 ? 'thread' : 'threads'}
                </Badge>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}