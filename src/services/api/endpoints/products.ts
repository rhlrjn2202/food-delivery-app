import { apiClient } from '../client';
import { mockProducts } from '../../../data/mockData';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_name: string;
}

const isDevelopment = import.meta.env.DEV;

export const productsApi = {
  getAll: async (category?: string) => {
    if (isDevelopment) {
      return category 
        ? mockProducts.filter(p => p.category_name.toLowerCase() === category.toLowerCase())
        : mockProducts;
    }

    const response = await apiClient.get('/products', {
      params: category ? { category } : undefined
    });
    return response.data;
  }
};