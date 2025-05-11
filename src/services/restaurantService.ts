import axios from 'axios';

const API_URL = 'http://localhost:8080';

export interface Restaurant {
  ID: number;
  Name: string;
  Description: string;
  Location: string;
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
  }
}; 