import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Configure axios defaults
axios.defaults.withCredentials = true;

export interface RegisterData {
  firstName: string;
  lastName: string;
  password: string;
  username: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export const authService = {
  async login(data: LoginData) {
    try {
      const response = await axios.post(`${API_URL}/login`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getUserData() {
    try {
      const response = await axios.get(`${API_URL}/user/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async register(data: RegisterData) {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    // Since we don't have a logout API, we'll just clear any local storage
    // and cookies will be handled by the browser when they expire
    localStorage.clear();
    window.location.href = '/login';
  },

  isAuthenticated() {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    return !!userData;
  },

  isAdmin() {
    const userData = localStorage.getItem('user');
    if (!userData) return false;
    
    try {
      const user = JSON.parse(userData);
      // Check if role is 'admin' (case insensitive)
      return user.role?.toLowerCase() === 'admin';
    } catch (error) {
      console.error('Error parsing user data:', error);
      return false;
    }
  },

  isRestaurantAdmin(): boolean {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    try {
      const user = JSON.parse(userData);
      return user.role?.toLowerCase() === "restaurant_admin";
    } catch {
      return false;
    }
  },

  isDeliveryPerson(): boolean {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    try {
      const user = JSON.parse(userData);
      return user.role?.toLowerCase() === "delivery_person";
    } catch {
      return false;
    }
  }
}; 