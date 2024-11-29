import { apiClient } from '../client';

export interface DeliveryResponse {
  available: boolean;
}

export const deliveryApi = {
  verifyPincode: async (pincode: string): Promise<DeliveryResponse> => {
    try {
      const response = await apiClient.get(`/verify-pincode/${pincode}`);
      return response.data;
    } catch (error: any) {
      console.error('Error verifying pincode:', error);
      throw new Error(error.message || 'Failed to verify pincode');
    }
  },
};