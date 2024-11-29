import { apiClient } from '../client';
import { mockCategories } from '../../../data/mockData';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

const isDevelopment = import.meta.env.DEV;

export const categoriesApi = {
  getAll: async () => {
    if (isDevelopment) {
      return mockCategories;
    }

    const response = await apiClient.get('/categories');
    return response.data;
  }
};