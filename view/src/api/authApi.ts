import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth/logout`);
    // Remove token from localStorage
    localStorage.removeItem('token');
  } catch (error) {
    // Even if the API call fails, we still want to remove the token
    localStorage.removeItem('token');
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
