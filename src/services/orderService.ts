import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface OrderData {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    email: string;
    pincode: string;
  };
  orderDate: string;
}

export async function verifyPincode(pincode: string): Promise<boolean> {
  try {
    const response = await axios.get(`${API_URL}/delivery/verify-pincode/${pincode}`);
    return response.data.available;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify pincode';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function placeOrder(orderData: OrderData): Promise<void> {
  try {
    await axios.post(`${API_URL}/orders`, orderData);
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
      throw new Error(errorMessage);
    }
    throw new Error('An unexpected error occurred');
  }
}