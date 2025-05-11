import axios from 'axios';

const API_URL = 'http://localhost:8080';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  restaurantId: number;
}

export const menuService = {
  getRestaurantMenu: async (restaurantId: number): Promise<MenuItem[]> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/menu`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching menu for restaurant ${restaurantId}:`, error);
      throw error;
    }
  }
}; 