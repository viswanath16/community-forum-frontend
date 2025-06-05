import axios from 'axios';

const API_URL = 'https://community-forum-backend.netlify.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data?.categories || []; // Ensure we always return an array
};

export const fetchCategory = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const fetchThreads = async (categoryId?: string) => {
  try {
    const url = categoryId ? `/threads?categoryId=${categoryId}` : '/threads';
    const response = await api.get(url);
    return response.data?.threads || []; // Ensure we always return an array
  } catch (error) {
    console.error('Error fetching threads:', error);
    return []; // Return empty array on error to prevent undefined.slice
  }
};

export const fetchThread = async (id: string) => {
  const response = await api.get(`/threads/${id}`);
  return response.data;
};

export const createThread = async (data: {
  title: string;
  content: string;
  categoryId: string;
}) => {
  const response = await api.post('/threads', data);
  return response.data;
};

export const fetchPosts = async (threadId: string) => {
  const response = await api.get(`/posts?threadId=${threadId}`);
  return response.data;
};

export const createPost = async (data: {
  content: string;
  threadId: string;
}) => {
  const response = await api.post('/posts', data);
  return response.data;
};

export const fetchUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};

export const searchContent = async (query: string) => {
  const response = await api.get(`/search?q=${query}`);
  return response.data;
};

// Marketplace API endpoints
export const fetchListings = async () => {
  const response = await api.get('/marketplace/listings');
  return response.data?.listings || [];
};

export const fetchListing = async (id: string) => {
  const response = await api.get(`/marketplace/listings/${id}`);
  return response.data;
};

export const createListing = async (data: {
  title: string;
  description: string;
  price: string;
  category: string;
  location: string;
  images?: string[];
}) => {
  const response = await api.post('/marketplace/listings', data);
  return response.data;
};

export const updateListing = async (id: string, data: any) => {
  const response = await api.put(`/marketplace/listings/${id}`, data);
  return response.data;
};

export const deleteListing = async (id: string) => {
  const response = await api.delete(`/marketplace/listings/${id}`);
  return response.data;
};

export default api;