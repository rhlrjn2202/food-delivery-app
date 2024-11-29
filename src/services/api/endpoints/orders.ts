import { apiClient } from '../client';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  user_id: number;
  items: OrderItem[];
  total: number;
  delivery_fee: number;
  payment_method: 'cod' | 'prepaid';
}

export const ordersApi = {
  create: async (orderData: OrderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Failed to create order');
    }
  },
};