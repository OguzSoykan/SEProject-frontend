import axios from 'axios';

const API_URL = 'http://localhost:8080';

export interface OrderItem {
  name: string;
  quantity: number;
}

export interface Order {
  id: number;
  user: string;
  restaurant: string;
  address: string;
  status: string;
  items: OrderItem[];
  total: string;
}

export interface PlaceOrderRequest {
  address: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
  restaurant_id: number;
}

export const orderService = {
  getUserOrders: async (): Promise<Order[]> => {
    try {
      const response = await axios.get(`${API_URL}/user/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  placeOrder: async (orderData: PlaceOrderRequest): Promise<Order> => {
    try {
      const response = await axios.post(`${API_URL}/order/place`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }
}; 