'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createListing } from '@/lib/api';
import { ChevronLeft, AlertCircle, ImagePlus } from 'lucide-react';

const listingSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  price: z.string().min(1, { message: 'Please enter a price' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  location: z.string().min(1, { message: 'Please enter a location' }),
  images: z.array(z.string()).optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'books', name: 'Books' },
  { id: 'sports', name: 'Sports & Outdoors' },
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'other', name: 'Other' },
];

export default function CreateListingPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: '',
      location: '',
      images: [],
    },
  });

  const onSubmit = async (data: ListingFormValues) => {
    try {
      setSubmitting(true);
      setError(null);
      
      const listing = await createListing(data);
      router.push(`/marketplace/${listing.id}`);
    } catch (err: any) {
      console.error('Error creating listing:', err);
      setError(err.message || 'Failed to create listing. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/marketplace">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Listing</CardTitle>
          <CardDescription>
            List an item for sale in the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive\" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What are you selling?"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={submitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter price"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Where is the item located?"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your item in detail..."
                        className="min-h-[200px]"
                        {...field}
                        disabled={submitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Images</FormLabel>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-32 w-full"
                    disabled={submitting}
                  >
                    <ImagePlus className="h-8 w-8 mb-2" />
                    <span>Add Image</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Listing'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Please ensure your listing follows our community guidelines.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}