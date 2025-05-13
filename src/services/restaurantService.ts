import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Helper function to format image URL
const formatImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  cuisine: string;
  avg_price: number;
  rating: number;
  image_url: string;
}

export const restaurantService = {
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants`);
      // Ensure each restaurant has a properly formatted image_url
      return response.data.map((restaurant: Restaurant) => ({
        ...restaurant,
        image_url: formatImageUrl(restaurant.image_url)
      }));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  },

  getRestaurantById: async (id: number): Promise<Restaurant> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${id}`);
      const restaurant = response.data;
      return {
        ...restaurant,
        image_url: formatImageUrl(restaurant.image_url)
      };
    } catch (error) {
      console.error(`Error fetching restaurant ${id}:`, error);
      throw error;
    }
  },

  getFilteredRestaurants: async (queryParams: string): Promise<Restaurant[]> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/search?${queryParams}`);
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      // Ensure each restaurant has a properly formatted image_url
      return data.map((restaurant: Restaurant) => ({
        ...restaurant,
        image_url: formatImageUrl(restaurant.image_url)
      }));
    } catch (error) {
      console.error('Error fetching filtered restaurants:', error);
      throw error;
    }
  }
}; 