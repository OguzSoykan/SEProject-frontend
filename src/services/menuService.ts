import axios from 'axios';

const API_URL = 'http://localhost:8080';

// Helper function to format image URL
const formatImageUrl = (imageUrl: string | null | undefined): string => {
  if (!imageUrl) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${API_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

export interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  price: number;
  image_url: string;
}

export const menuService = {
  getRestaurantMenu: async (restaurantId: number): Promise<MenuItem[]> => {
    try {
      const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/menu`);
      return response.data.map((item: MenuItem) => ({
        ...item,
        image_url: formatImageUrl(item.image_url)
      }));
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  }
}; 