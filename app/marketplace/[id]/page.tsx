'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getCurrentUser } from '@/lib/auth';
import { fetchListing } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft, Tag, DollarSign, MapPin, AlertCircle } from 'lucide-react';

export default function ListingPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading user:', err);
      }
    };

    const loadListing = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const data = await fetchListing(params.id);
        setListing(data);
        setError(null);
      } catch (err) {
        console.error('Error loading listing:', err);
        setError('Failed to load listing. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    loadListing();
  }, [params.id]);

  const handleContact = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    // Implement contact functionality
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Skeleton className="aspect-video w-full rounded-lg mb-4" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded" />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-destructive text-center p-6">
          {error || 'Listing not found'}
        </div>
        <div className="text-center mt-4">
          <Button variant="outline" asChild>
            <Link href="/marketplace">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" asChild>
        <Link href="/marketplace">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {listing.images?.length > 0 && (
            <>
              <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="object-cover w-full h-full"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {listing.images.slice(1).map((image, index) => (
                    <div key={index} className="aspect-video relative rounded overflow-hidden">
                      <img
                        src={image}
                        alt={`${listing.title} - Image ${index + 2}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
          <div className="flex items-center space-x-2 mb-6">
            <Badge variant="secondary">
              <Tag className="mr-1 h-3 w-3" />
              {listing.category}
            </Badge>
            <Badge>
              <DollarSign className="mr-1 h-3 w-3" />
              {listing.price}
            </Badge>
            {listing.location && (
              <Badge variant="outline">
                <MapPin className="mr-1 h-3 w-3" />
                {listing.location}
              </Badge>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            {listing.description}
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={listing.seller.avatarUrl} alt={listing.seller.username} />
                  <AvatarFallback>
                    {listing.seller.username?.charAt(0) || listing.seller.email?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{listing.seller.username || listing.seller.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Member since {formatDistanceToNow(new Date(listing.seller.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {listing.seller.id === user?.id ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is your listing. You can edit or delete it from your profile.
              </AlertDescription>
            </Alert>
          ) : (
            <Button className="w-full" size="lg" onClick={handleContact}>
              Contact Seller
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}