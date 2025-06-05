import Link from 'next/link';
import { ArrowRight, MessageSquare, Users, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryList from '@/components/home/CategoryList';
import RecentThreads from '@/components/home/RecentThreads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="py-12 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to our <span className="text-primary">Community Forum</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mb-8">
          Join thousands of members discussing topics that matter. Share knowledge, ask questions, and connect with others in our growing community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button size="lg" asChild>
            <Link href="/register">
              Join Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/categories">Browse Categories</Link>
          </Button>
        </div>
        <div className="flex items-center gap-8 text-muted-foreground">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">10k+</span>
            <span className="text-sm">Members</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">5k+</span>
            <span className="text-sm">Threads</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">50k+</span>
            <span className="text-sm">Posts</span>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 border-t border-b border-border">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join Our Community?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="pb-2">
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Meaningful Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Engage in deep, thoughtful conversations on topics that matter to you with a community of like-minded individuals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Connect with Others</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Build relationships with members who share your interests, exchange ideas, and expand your network.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Knowledge Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Learn from experts, share your expertise, and contribute to a growing repository of collective wisdom.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Categories</h2>
          <Button variant="outline" asChild>
            <Link href="/categories">View All</Link>
          </Button>
        </div>
        <CategoryList />
      </section>

      {/* Recent threads */}
      <section className="py-16 border-t border-border">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Discussions</h2>
          <Button variant="outline" asChild>
            <Link href="/threads">View All</Link>
          </Button>
        </div>
        <RecentThreads />
      </section>

      {/* CTA section */}
      <section className="py-16 border-t border-border">
        <div className="bg-card rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join our community today and be part of the conversation. It's free and only takes a minute to sign up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Create an Account</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}