import { QueryClient } from 'react-query';
import { apiClient } from './client';
import { categoriesApi } from './endpoints/categories';
import { productsApi } from './endpoints/products';
import { ordersApi } from './endpoints/orders';
import { deliveryApi } from './endpoints/delivery';

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

// Export API modules
export const api = {
  categories: categoriesApi,
  products: productsApi,
  orders: ordersApi,
  delivery: deliveryApi,
};

export { apiClient };