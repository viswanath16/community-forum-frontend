import { Thread, User, Category, Post } from '@/types';

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'john_doe',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    bio: 'Software developer passionate about web technologies',
    location: 'San Francisco, CA',
    website: 'https://johndoe.dev',
    joinedAt: '2024-01-15T10:00:00Z',
    role: 'user',
    isVerified: true,
    postCount: 25,
    threadCount: 8
  },
  {
    id: '2',
    email: 'sarah@example.com',
    username: 'sarah_wilson',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    bio: 'UX designer and frontend enthusiast',
    location: 'New York, NY',
    joinedAt: '2024-02-01T14:30:00Z',
    role: 'moderator',
    isVerified: true,
    postCount: 42,
    threadCount: 12
  },
  {
    id: '3',
    email: 'mike@example.com',
    username: 'mike_chen',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    bio: 'Full-stack developer and tech blogger',
    location: 'Seattle, WA',
    joinedAt: '2024-01-20T09:15:00Z',
    role: 'user',
    isVerified: true,
    postCount: 18,
    threadCount: 6
  }
];

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'General Discussion',
    description: 'General topics and community discussions',
    slug: 'general',
    color: '#3B82F6',
    icon: 'MessageSquare',
    threadCount: 45,
    postCount: 234,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack development',
    slug: 'web-dev',
    color: '#10B981',
    icon: 'Code',
    threadCount: 32,
    postCount: 189,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Design & UI/UX',
    description: 'Design discussions, UI/UX best practices',
    slug: 'design',
    color: '#F59E0B',
    icon: 'Palette',
    threadCount: 28,
    postCount: 156,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Best practices for React component architecture',
    content: '<p>I\'ve been working on a large React application and I\'m looking for advice on how to structure components effectively. What are your favorite patterns for organizing components, managing state, and ensuring reusability?</p><p>Some specific questions:</p><ul><li>How do you decide when to create a new component vs extending an existing one?</li><li>What\'s your approach to prop drilling and state management?</li><li>Any recommendations for folder structure?</li></ul>',
    author: mockUsers[0],
    categoryId: '2',
    category: mockCategories[1],
    createdAt: '2024-12-15T10:30:00Z',
    updatedAt: '2024-12-15T10:30:00Z',
    isPinned: true,
    isLocked: false,
    viewCount: 156,
    postCount: 12,
    upvotes: 8,
    downvotes: 0,
    tags: ['react', 'architecture', 'best-practices']
  },
  {
    id: '2',
    title: 'Introducing myself to the community',
    content: '<p>Hi everyone! I\'m new to this community and excited to be here. I\'m a frontend developer with 3 years of experience, primarily working with React and TypeScript.</p><p>I\'m particularly interested in:</p><ul><li>Modern CSS techniques</li><li>Performance optimization</li><li>Accessibility best practices</li></ul><p>Looking forward to learning from all of you and contributing where I can!</p>',
    author: mockUsers[1],
    categoryId: '1',
    category: mockCategories[0],
    createdAt: '2024-12-14T16:45:00Z',
    updatedAt: '2024-12-14T16:45:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 89,
    postCount: 7,
    upvotes: 15,
    downvotes: 0,
    tags: ['introduction', 'frontend', 'react']
  },
  {
    id: '3',
    title: 'Color theory for web designers - comprehensive guide',
    content: '<p>Color is one of the most powerful tools in a designer\'s toolkit. In this post, I want to share some insights about color theory and how it applies to web design.</p><p><strong>The Color Wheel Basics:</strong></p><p>Understanding primary, secondary, and tertiary colors is fundamental. But more importantly for web design, we need to consider:</p><ul><li>Color harmony and contrast</li><li>Accessibility considerations (WCAG guidelines)</li><li>Cultural associations with colors</li><li>Brand consistency</li></ul><p>I\'ll be sharing more detailed examples and tools in the comments below.</p>',
    author: mockUsers[1],
    categoryId: '3',
    category: mockCategories[2],
    createdAt: '2024-12-13T14:20:00Z',
    updatedAt: '2024-12-13T14:20:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 203,
    postCount: 18,
    upvotes: 22,
    downvotes: 1,
    tags: ['design', 'color-theory', 'accessibility']
  },
  {
    id: '4',
    title: 'Help with TypeScript generics',
    content: '<p>I\'m struggling to understand TypeScript generics and when to use them. I\'ve read the documentation but I\'m having trouble applying the concepts to real-world scenarios.</p><p>Can someone explain:</p><ol><li>When should I use generics vs any or unknown?</li><li>How do I create reusable generic functions?</li><li>What are some common patterns I should know?</li></ol><p>Any examples would be greatly appreciated!</p>',
    author: mockUsers[2],
    categoryId: '2',
    category: mockCategories[1],
    createdAt: '2024-12-12T11:15:00Z',
    updatedAt: '2024-12-12T11:15:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 134,
    postCount: 9,
    upvotes: 6,
    downvotes: 0,
    tags: ['typescript', 'generics', 'help']
  },
  {
    id: '5',
    title: 'Weekly design inspiration thread',
    content: '<p>Share your favorite design discoveries from this week! This can include:</p><ul><li>Websites with great UX</li><li>Interesting UI patterns</li><li>Color palettes that caught your eye</li><li>Typography choices you loved</li><li>Micro-interactions that delighted you</li></ul><p>Let\'s inspire each other and build a collection of great design examples!</p>',
    author: mockUsers[1],
    categoryId: '3',
    category: mockCategories[2],
    createdAt: '2024-12-11T09:00:00Z',
    updatedAt: '2024-12-11T09:00:00Z',
    isPinned: true,
    isLocked: false,
    viewCount: 267,
    postCount: 24,
    upvotes: 31,
    downvotes: 0,
    tags: ['inspiration', 'weekly', 'showcase']
  },
  {
    id: '6',
    title: 'Performance optimization tips for React apps',
    content: '<p>After working on several large React applications, I\'ve learned some valuable lessons about performance optimization. Here are my top tips:</p><p><strong>1. Memoization</strong></p><p>Use React.memo, useMemo, and useCallback strategically, but don\'t overuse them.</p><p><strong>2. Code Splitting</strong></p><p>Implement lazy loading for routes and heavy components.</p><p><strong>3. Bundle Analysis</strong></p><p>Regularly analyze your bundle size and eliminate unnecessary dependencies.</p><p>What other techniques have worked well for you?</p>',
    author: mockUsers[0],
    categoryId: '2',
    category: mockCategories[1],
    createdAt: '2024-12-10T13:30:00Z',
    updatedAt: '2024-12-10T13:30:00Z',
    isPinned: false,
    isLocked: false,
    viewCount: 178,
    postCount: 14,
    upvotes: 19,
    downvotes: 0,
    tags: ['react', 'performance', 'optimization']
  }
];

// Mock current user (simulating logged-in state)
const mockCurrentUser: User = mockUsers[0];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
export const authAPI = {
  register: async (email: string, password: string, username?: string) => {
    await delay(1000);
    const newUser: User = {
      id: Date.now().toString(),
      email,
      username: username || email.split('@')[0],
      joinedAt: new Date().toISOString(),
      role: 'user',
      isVerified: false,
      postCount: 0,
      threadCount: 0
    };
    return { user: newUser, token: 'mock-token-' + Date.now() };
  },

  login: async (email: string, password: string) => {
    await delay(800);
    const user = mockUsers.find(u => u.email === email) || mockCurrentUser;
    const token = 'mock-token-' + Date.now();
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    return { user, token };
  },

  logout: async () => {
    await delay(300);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  refreshToken: async () => {
    await delay(500);
    const token = 'mock-token-' + Date.now();
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    return { token };
  },

  forgotPassword: async (email: string) => {
    await delay(1000);
    return { message: 'Password reset email sent' };
  },

  resetPassword: async (token: string, password: string) => {
    await delay(1000);
    return { message: 'Password reset successful' };
  },

  verifyEmail: async (token: string) => {
    await delay(800);
    return { message: 'Email verified successfully' };
  },

  resendVerification: async (email: string) => {
    await delay(1000);
    return { message: 'Verification email sent' };
  }
};

export const usersAPI = {
  getProfile: async (userId?: string) => {
    await delay(500);
    if (userId) {
      return mockUsers.find(u => u.id === userId) || mockUsers[0];
    }
    return mockCurrentUser;
  },

  updateProfile: async (data: any) => {
    await delay(800);
    return { ...mockCurrentUser, ...data };
  },

  uploadAvatar: async (file: File) => {
    await delay(1500);
    return { avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1' };
  },

  getUsers: async (params?: any) => {
    await delay(600);
    return {
      users: mockUsers,
      total: mockUsers.length,
      page: params?.page || 1,
      limit: params?.limit || 10
    };
  },

  updateUserRole: async (userId: string, role: string) => {
    await delay(800);
    return { message: 'User role updated' };
  },

  banUser: async (userId: string, reason?: string) => {
    await delay(800);
    return { message: 'User banned' };
  },

  unbanUser: async (userId: string) => {
    await delay(800);
    return { message: 'User unbanned' };
  }
};

export const categoriesAPI = {
  getAll: async () => {
    await delay(400);
    return mockCategories;
  },

  getBySlug: async (slug: string) => {
    await delay(500);
    return mockCategories.find(c => c.slug === slug) || mockCategories[0];
  },

  create: async (data: any) => {
    await delay(800);
    const newCategory: Category = {
      id: Date.now().toString(),
      ...data,
      threadCount: 0,
      postCount: 0,
      createdAt: new Date().toISOString()
    };
    return newCategory;
  },

  update: async (id: string, data: any) => {
    await delay(800);
    const category = mockCategories.find(c => c.id === id);
    return { ...category, ...data };
  },

  delete: async (id: string) => {
    await delay(600);
    return { message: 'Category deleted' };
  },

  reorder: async (categoryIds: string[]) => {
    await delay(600);
    return { message: 'Categories reordered' };
  }
};

export const threadsAPI = {
  getAll: async (params?: any) => {
    await delay(600);
    let filteredThreads = [...mockThreads];
    
    if (params?.categoryId) {
      filteredThreads = filteredThreads.filter(t => t.categoryId === params.categoryId);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredThreads = filteredThreads.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort threads
    if (params?.sort === 'popular') {
      filteredThreads.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else if (params?.sort === 'oldest') {
      filteredThreads.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // Default: latest
      filteredThreads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return {
      threads: filteredThreads,
      total: filteredThreads.length,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  getById: async (id: string) => {
    await delay(500);
    return mockThreads.find(t => t.id === id) || mockThreads[0];
  },

  create: async (data: any) => {
    await delay(1000);
    const category = mockCategories.find(c => c.id === data.categoryId) || mockCategories[0];
    const newThread: Thread = {
      id: Date.now().toString(),
      title: data.title,
      content: data.content,
      author: mockCurrentUser,
      categoryId: data.categoryId,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: data.isPinned || false,
      isLocked: false,
      viewCount: 0,
      postCount: 0,
      upvotes: 0,
      downvotes: 0,
      tags: data.tags || []
    };
    return newThread;
  },

  update: async (id: string, data: any) => {
    await delay(800);
    const thread = mockThreads.find(t => t.id === id);
    return { ...thread, ...data, updatedAt: new Date().toISOString() };
  },

  delete: async (id: string) => {
    await delay(600);
    return { message: 'Thread deleted' };
  },

  pin: async (id: string) => {
    await delay(500);
    return { message: 'Thread pinned' };
  },

  unpin: async (id: string) => {
    await delay(500);
    return { message: 'Thread unpinned' };
  },

  lock: async (id: string) => {
    await delay(500);
    return { message: 'Thread locked' };
  },

  unlock: async (id: string) => {
    await delay(500);
    return { message: 'Thread unlocked' };
  },

  vote: async (id: string, type: 'up' | 'down') => {
    await delay(400);
    return { message: 'Vote recorded' };
  },

  removeVote: async (id: string) => {
    await delay(400);
    return { message: 'Vote removed' };
  }
};

export const postsAPI = {
  getByThread: async (threadId: string, params?: any) => {
    await delay(500);
    // Mock posts for the thread
    const mockPosts: Post[] = [
      {
        id: '1',
        content: '<p>Great question! I\'ve been using a pattern where I separate presentational components from container components. This helps with reusability and testing.</p>',
        author: mockUsers[1],
        threadId,
        createdAt: '2024-12-15T11:00:00Z',
        updatedAt: '2024-12-15T11:00:00Z',
        upvotes: 5,
        downvotes: 0,
        isAnswer: false
      },
      {
        id: '2',
        content: '<p>I recommend checking out the compound component pattern. It\'s really useful for building flexible and reusable UI components.</p>',
        author: mockUsers[2],
        threadId,
        createdAt: '2024-12-15T12:30:00Z',
        updatedAt: '2024-12-15T12:30:00Z',
        upvotes: 3,
        downvotes: 0,
        isAnswer: false
      }
    ];
    
    return {
      posts: mockPosts,
      total: mockPosts.length,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  getById: async (id: string) => {
    await delay(400);
    return {
      id,
      content: '<p>This is a mock post content.</p>',
      author: mockUsers[0],
      threadId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isAnswer: false
    };
  },

  create: async (data: any) => {
    await delay(800);
    const newPost: Post = {
      id: Date.now().toString(),
      content: data.content,
      author: mockCurrentUser,
      threadId: data.threadId,
      parentId: data.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isAnswer: false
    };
    return newPost;
  },

  update: async (id: string, data: any) => {
    await delay(600);
    return { id, ...data, updatedAt: new Date().toISOString() };
  },

  delete: async (id: string) => {
    await delay(500);
    return { message: 'Post deleted' };
  },

  vote: async (id: string, type: 'up' | 'down') => {
    await delay(400);
    return { message: 'Vote recorded' };
  },

  removeVote: async (id: string) => {
    await delay(400);
    return { message: 'Vote removed' };
  },

  markAsAnswer: async (id: string) => {
    await delay(500);
    return { message: 'Post marked as answer' };
  },

  unmarkAsAnswer: async (id: string) => {
    await delay(500);
    return { message: 'Post unmarked as answer' };
  }
};

export const searchAPI = {
  search: async (params: any) => {
    await delay(700);
    const searchLower = params.q.toLowerCase();
    const results = mockThreads.filter(t => 
      t.title.toLowerCase().includes(searchLower) ||
      t.content.toLowerCase().includes(searchLower)
    );
    
    return {
      results,
      total: results.length,
      page: params.page || 1,
      limit: params.limit || 20
    };
  },

  suggestions: async (q: string) => {
    await delay(300);
    return ['react', 'typescript', 'design', 'performance'].filter(s => 
      s.toLowerCase().includes(q.toLowerCase())
    );
  }
};

export const notificationsAPI = {
  getAll: async (params?: any) => {
    await delay(500);
    return {
      notifications: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  markAsRead: async (id: string) => {
    await delay(300);
    return { message: 'Notification marked as read' };
  },

  markAllAsRead: async () => {
    await delay(400);
    return { message: 'All notifications marked as read' };
  },

  delete: async (id: string) => {
    await delay(300);
    return { message: 'Notification deleted' };
  },

  getUnreadCount: async () => {
    await delay(200);
    return { count: 0 };
  }
};

export const marketplaceAPI = {
  getListings: async (params?: any) => {
    await delay(600);
    return {
      listings: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  getListing: async (id: string) => {
    await delay(500);
    return null;
  },

  createListing: async (data: any) => {
    await delay(1000);
    return { id: Date.now().toString(), ...data };
  },

  updateListing: async (id: string, data: any) => {
    await delay(800);
    return { id, ...data };
  },

  deleteListing: async (id: string) => {
    await delay(600);
    return { message: 'Listing deleted' };
  },

  getMyListings: async (params?: any) => {
    await delay(500);
    return {
      listings: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  markAsSold: async (id: string) => {
    await delay(500);
    return { message: 'Listing marked as sold' };
  },

  toggleFavorite: async (id: string) => {
    await delay(400);
    return { message: 'Favorite toggled' };
  },

  getFavorites: async (params?: any) => {
    await delay(500);
    return {
      listings: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  reportListing: async (id: string, data: any) => {
    await delay(600);
    return { message: 'Listing reported' };
  },

  contactSeller: async (id: string, data: any) => {
    await delay(800);
    return { message: 'Message sent to seller' };
  },

  getCategories: async () => {
    await delay(400);
    return [];
  },

  uploadImages: async (files: File[]) => {
    await delay(2000);
    return { imageUrls: files.map(() => 'https://images.pexels.com/photos/placeholder.jpg') };
  }
};

export const messagesAPI = {
  getConversations: async (params?: any) => {
    await delay(500);
    return {
      conversations: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  getConversation: async (id: string, params?: any) => {
    await delay(500);
    return {
      messages: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  sendMessage: async (data: any) => {
    await delay(600);
    return { id: Date.now().toString(), ...data };
  },

  markAsRead: async (conversationId: string) => {
    await delay(300);
    return { message: 'Conversation marked as read' };
  },

  deleteConversation: async (id: string) => {
    await delay(500);
    return { message: 'Conversation deleted' };
  }
};

export const reportsAPI = {
  create: async (data: any) => {
    await delay(800);
    return { id: Date.now().toString(), ...data };
  },

  getAll: async (params?: any) => {
    await delay(600);
    return {
      reports: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 20
    };
  },

  getById: async (id: string) => {
    await delay(500);
    return null;
  },

  updateStatus: async (id: string, status: string) => {
    await delay(600);
    return { message: 'Report status updated' };
  }
};

export const analyticsAPI = {
  getStats: async () => {
    await delay(800);
    return {
      totalUsers: mockUsers.length,
      totalThreads: mockThreads.length,
      totalPosts: 150,
      totalCategories: mockCategories.length
    };
  },

  getUserActivity: async (params?: any) => {
    await delay(600);
    return { activity: [] };
  },

  getPopularContent: async (params?: any) => {
    await delay(600);
    return { content: mockThreads.slice(0, 5) };
  }
};

// Legacy API functions for backward compatibility
export const fetchCategories = categoriesAPI.getAll;
export const fetchCategory = categoriesAPI.getBySlug;
export const fetchThreads = async (params?: any) => {
  const result = await threadsAPI.getAll(params);
  return result.threads || result;
};
export const fetchThread = threadsAPI.getById;
export const createThread = threadsAPI.create;
export const fetchPosts = async (threadId: string, params?: any) => {
  const result = await postsAPI.getByThread(threadId, params);
  return result.posts || result;
};
export const createPost = postsAPI.create;
export const fetchUserProfile = usersAPI.getProfile;
export const updateUserProfile = usersAPI.updateProfile;
export const searchContent = searchAPI.search;
export const fetchListings = async (params?: any) => {
  const result = await marketplaceAPI.getListings(params);
  return result.listings || result;
};
export const fetchListing = marketplaceAPI.getListing;
export const createListing = marketplaceAPI.createListing;
export const updateListing = marketplaceAPI.updateListing;
export const deleteListing = marketplaceAPI.deleteListing;
export const fetchMyListings = async (params?: any) => {
  const result = await marketplaceAPI.getMyListings(params);
  return result.listings || result;
};
export const markListingAsSold = marketplaceAPI.markAsSold;
export const favoriteListingToggle = marketplaceAPI.toggleFavorite;
export const fetchFavoriteListings = async (params?: any) => {
  const result = await marketplaceAPI.getFavorites(params);
  return result.listings || result;
};
export const reportListing = marketplaceAPI.reportListing;
export const fetchMarketplaceCategories = marketplaceAPI.getCategories;
export const contactSeller = marketplaceAPI.contactSeller;

// Mock function to get current user
export const getCurrentUser = async (): Promise<User | null> => {
  await delay(300);
  if (typeof window !== 'undefined' && localStorage.getItem('authToken')) {
    return mockCurrentUser;
  }
  return null;
};

// Default export for compatibility
export default {
  authAPI,
  usersAPI,
  categoriesAPI,
  threadsAPI,
  postsAPI,
  searchAPI,
  notificationsAPI,
  marketplaceAPI,
  messagesAPI,
  reportsAPI,
  analyticsAPI
};