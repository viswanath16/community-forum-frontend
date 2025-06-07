export interface User {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
  role?: string;
  rating?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  threadCount: number;
  postCount: number;
  parentId?: string;
  subcategories?: Category[];
}

export interface Thread {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  postCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastPostAt: string;
  lastPostAuthor?: User;
}

export interface Post {
  id: string;
  content: string;
  threadId: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  isAnswer?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'reply' | 'like';
  message: string;
  read: boolean;
  relatedId: string;
  createdAt: string;
}

export interface SearchResult {
  type: 'thread' | 'post';
  id: string;
  title?: string;
  content: string;
  author: User;
  createdAt: string;
  threadId?: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  status: 'active' | 'sold' | 'inactive';
  images?: string[];
  tags?: string[];
  seller: User;
  createdAt: string;
  updatedAt: string;
  isFavorited?: boolean;
  viewCount?: number;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  subcategories?: MarketplaceCategory[];
}