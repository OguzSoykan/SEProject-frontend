import axios from 'axios';

const API_URL = 'http://localhost:8080';

export interface Restaurant {
  ID: number;
  Name: string;
  Description: string;
  Location: string;
  Cuisine: string;
  avg_price: number;
  rating: number;
}

export const restaurantService = {
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    try {
      const response = await fetch('http://localhost:8080/restaurants');
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      return response.json();
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
      const response = await axios.get(`${API_URL}/restaurants/filter?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered restaurants:', error);
      throw error;
    }
  }
}; 