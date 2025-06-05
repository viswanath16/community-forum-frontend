'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCategories } from '@/lib/api';
import { Category } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, MessageSquare } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
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
        <div className="text-destructive text-center p-6">{error}</div>
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
      </div>
      
      <div className="space-y-6">
        {parentCategories.map((category) => (
          <div key={category.id}>
            <Link href={`/categories/${category.slug}`}>
              <Card className="hover:shadow-md transition-shadow mb-4 cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                      <Badge variant="secondary">
                        {category.threadCount} {category.threadCount === 1 ? 'thread' : 'threads'}
                      </Badge>
                      <Badge variant="outline">
                        {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="ml-8 space-y-4 mt-4 mb-6">
                {category.subcategories.map((subcategory) => (
                  <Link key={subcategory.id} href={`/categories/${subcategory.slug}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                        <CardDescription>{subcategory.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-4">
                            <Badge variant="secondary">
                              {subcategory.threadCount} {subcategory.threadCount === 1 ? 'thread' : 'threads'}
                            </Badge>
                            <Badge variant="outline">
                              {subcategory.postCount} {subcategory.postCount === 1 ? 'post' : 'posts'}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
    </div>
  );
}