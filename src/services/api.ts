import axios from 'axios';
import { QueryClient } from 'react-query';

// Create query client with retry configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: new Date().getTime(),
    };

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    // Check if the response has error property
    if (response.data.error) {
      return Promise.reject({
        message: response.data.message || 'Server error occurred',
        status: response.status,
      });
    }
    return response.data;
  },
  async (error) => {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
      return Promise.reject({
        message: error.response.data.message || 'Server error occurred',
        status: error.response.status,
      });
    }
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timed out. Please try again.',
        status: 408,
      });
    }
    
    if (!navigator.onLine) {
      return Promise.reject({
        message: 'No internet connection. Please check your network.',
        status: 0,
      });
    }

    return Promise.reject({
      message: 'Network error occurred. Please try again.',
      status: 0,
    });
  }
);

// API service with improved error handling and retries
export const apiService = {
  // Categories
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response;
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Products
  getProducts: async (category?: string) => {
    try {
      const response = await api.get('/products', {
        params: category ? { category } : undefined
      });
      return response;
    } catch (error: any) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Orders
  createOrder: async (orderData: any) => {
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Delivery
  verifyPincode: async (pincode: string) => {
    try {
      const response = await api.get(`/verify-pincode/${pincode}`);
      return response;
    } catch (error: any) {
      console.error('Error verifying pincode:', error);
      throw error;
    }
  },
};

export { api };