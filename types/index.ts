export interface User {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  createdAt?: string;
  role?: 'user' | 'moderator' | 'admin';
  rating?: number;
  bio?: string;
  location?: string;
  website?: string;
  isVerified?: boolean;
  isBanned?: boolean;
  lastActiveAt?: string;
  threadCount?: number;
  postCount?: number;
  reputation?: number;
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
  color?: string;
  icon?: string;
  order?: number;
  isPrivate?: boolean;
  moderators?: User[];
}

export interface Thread {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  category?: Category;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  postCount: number;
  isPinned: boolean;
  isLocked: boolean;
  isDeleted?: boolean;
  lastPostAt: string;
  lastPostAuthor?: User;
  tags?: string[];
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  hasAnswer?: boolean;
}

export interface Post {
  id: string;
  content: string;
  threadId: string;
  thread?: Thread;
  authorId: string;
  author: User;
  parentId?: string;
  parent?: Post;
  replies?: Post[];
  createdAt: string;
  updatedAt: string;
  isAnswer?: boolean;
  isDeleted?: boolean;
  votes?: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  editHistory?: {
    editedAt: string;
    editedBy: User;
    reason?: string;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'reply' | 'vote' | 'follow' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  relatedId?: string;
  relatedType?: 'thread' | 'post' | 'user' | 'listing';
  actionUrl?: string;
  createdAt: string;
  data?: Record<string, any>;
}

export interface SearchResult {
  type: 'thread' | 'post' | 'user' | 'listing';
  id: string;
  title?: string;
  content: string;
  author?: User;
  createdAt: string;
  threadId?: string;
  categoryId?: string;
  category?: Category;
  relevanceScore?: number;
  highlights?: {
    title?: string[];
    content?: string[];
  };
}

export interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryName?: string;
  location: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  status: 'active' | 'sold' | 'inactive' | 'pending';
  images?: string[];
  tags?: string[];
  seller: User;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  isFavorited?: boolean;
  favoriteCount?: number;
  viewCount?: number;
  contactCount?: number;
  isPromoted?: boolean;
  expiresAt?: string;
}

export interface MarketplaceCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  subcategories?: MarketplaceCategory[];
  listingCount?: number;
  order?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  recipientId: string;
  recipient: User;
  content: string;
  createdAt: string;
  readAt?: string;
  isDeleted?: boolean;
  attachments?: {
    id: string;
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface Report {
  id: string;
  type: 'thread' | 'post' | 'user' | 'listing';
  targetId: string;
  target?: Thread | Post | User | MarketplaceListing;
  reporterId: string;
  reporter: User;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: User;
  resolution?: string;
}

export interface Analytics {
  totalUsers: number;
  totalThreads: number;
  totalPosts: number;
  totalListings: number;
  activeUsers: number;
  newUsersToday: number;
  newThreadsToday: number;
  newPostsToday: number;
  popularCategories: {
    category: Category;
    threadCount: number;
    postCount: number;
  }[];
  userActivity: {
    date: string;
    activeUsers: number;
    newUsers: number;
    posts: number;
    threads: number;
  }[];
}

export interface Vote {
  id: string;
  userId: string;
  user: User;
  targetId: string;
  targetType: 'thread' | 'post';
  type: 'up' | 'down';
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  usageCount: number;
  createdAt: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  emailNotifications: {
    replies: boolean;
    mentions: boolean;
    messages: boolean;
    newsletters: boolean;
  };
  privacy: {
    showEmail: boolean;
    showLocation: boolean;
    showOnlineStatus: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    postsPerPage: number;
  };
}