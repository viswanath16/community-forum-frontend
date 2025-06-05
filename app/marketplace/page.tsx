'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUser } from '@/lib/auth';
import { fetchListings } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Search, Tag, DollarSign } from 'lucide-react';

export default function MarketplacePage() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading user:', err);
      }
    };

    const loadListings = async () => {
      try {
        setLoading(true);
        const data = await fetchListings();
        setListings(data);
        setError(null);
      } catch (err) {
        console.error('Error loading listings:', err);
        setError('Failed to load marketplace listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    loadListings();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-20" />
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Browse and sell items in our community marketplace
            </p>
          </div>
          {user && (
            <Button asChild>
              <Link href="/marketplace/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Listing
              </Link>
            </Button>
          )}
        </div>

        <div className="flex gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <Button variant="outline">
            Filter
          </Button>
        </div>

        {listings.length === 0 ? (
          <Card className="p-8 text-center">
            <CardTitle className="mb-2">No listings yet</CardTitle>
            <CardDescription className="mb-6">
              Be the first to create a listing in our marketplace.
            </CardDescription>
            {user ? (
              <Button asChild>
                <Link href="/marketplace/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Listing
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Sign in to create a listing</Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/marketplace/${listing.id}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardHeader>
                    {listing.images?.[0] && (
                      <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        <Tag className="mr-1 h-3 w-3" />
                        {listing.category}
                      </Badge>
                      <Badge variant="outline">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {listing.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4">
                      {listing.description}
                    </CardDescription>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{listing.location}</span>
                      <span>
                        {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}