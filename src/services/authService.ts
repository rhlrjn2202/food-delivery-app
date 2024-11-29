import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create account');
  }
}

export function logout() {
  // Clear any server-side session if needed
  axios.post(`${API_URL}/auth/logout`);
}