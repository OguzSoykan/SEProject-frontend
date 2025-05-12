import axios from 'axios';

const API_URL = 'http://localhost:8080';

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  cuisine: string;
  avg_price: number;
  rating: number;
}

export const restaurantService = {
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants`);
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  getRestaurantById: async (id: number): Promise<Restaurant> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      throw error;
    }
  },

  getFilteredRestaurants: async (queryParams: string): Promise<Restaurant[]> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/search?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered restaurants:', error);
      throw error;
    }
  }
}; 