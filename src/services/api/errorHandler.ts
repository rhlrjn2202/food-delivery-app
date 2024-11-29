import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status: number;
}

export const handleApiError = async (error: AxiosError): Promise<never> => {
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
};