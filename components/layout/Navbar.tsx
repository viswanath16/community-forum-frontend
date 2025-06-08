'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, MessageSquare, Bell, User as UserIcon, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { signOut, getCurrentUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { User } from '@/types';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for auth state changes
    const handleAuthChange = (event: CustomEvent) => {
      const userData = event.detail;
      setUser(userData);
      setLoading(false);
    };

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'currentUser') {
        loadUser();
      }
    };

    window.addEventListener('authStateChanged', handleAuthChange as EventListener);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:space-x-10">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Forum</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative w-64">
              <form onSubmit={handleSearch}>
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </form>
            </div>
            <Link href="/categories">
              <Button variant="ghost">Categories</Button>
            </Link>
            <Link href="/threads">
              <Button variant="ghost">Threads</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="ghost" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Marketplace
              </Button>
            </Link>
          </div>

          {/* User menu for desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            ) : user ? (
              <>
                <Button variant="ghost\" size="icon\" asChild>
                  <Link href="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || ''} alt={user.username || user.email || ''} />
                        <AvatarFallback>
                          {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.username || user.email}
                        </p>
                        {user.username && (
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/marketplace/my-listings">My Listings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/marketplace/favorites">Favorites</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden',
          isMenuOpen ? 'block' : 'hidden'
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="p-2">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </form>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/categories">Categories</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/threads">Threads</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/marketplace">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Marketplace
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/notifications">Notifications</Link>
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              {loading ? (
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ) : user ? (
                <>
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatarUrl || ''} alt={user.username || user.email || ''} />
                      <AvatarFallback>
                        {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.username || user.email}</p>
                      {user.username && (
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/profile">Profile</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/marketplace/my-listings">My Listings</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/marketplace/favorites">Favorites</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/settings">Settings</Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}