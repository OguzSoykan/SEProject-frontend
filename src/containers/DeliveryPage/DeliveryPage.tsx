import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  user: string;
  restaurant: string;
  address: string;
  status: string;
  items: OrderItem[];
  total: string;
}

const DeliveryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/delivery/orders');
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkAsDelivered = async (orderId: number) => {
    try {
      await axios.put(`http://localhost:8080/restaurant/orders/${orderId}/delivered`);
      fetchOrders(); // Refresh the orders list
    } catch (err) {
      setError("Failed to mark order as delivered");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "prepared":
        return "text-yellow-500";
      case "delivered":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-primary-500";
    }
  };

  const renderOrderItems = (items: OrderItem[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="mt-4 text-sm text-gray-500">
          No items in this order
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="font-medium">{item.name}</span>
              <span className="mx-2 text-gray-500">×</span>
              <span className="text-gray-500">{item.quantity}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOrder = (order: Order) => {
    if (!order) return null;

    return (
      <div
        key={order.id}
        className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden z-0 relative"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-semibold">#{order.id}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                  <span>{order.restaurant}</span>
                  <span className="mx-2">·</span>
                  <span className={getStatusColor(order.status)}>{order.status}</span>
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Customer: {order.user}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Delivery Address: {order.address}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-primary-500">
                  ₺{order.total}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              {renderOrderItems(order.items)}
            </div>
          </div>
        </div>
        {order.status === "prepared" && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => handleMarkAsDelivered(order.id)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Mark as Delivered
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        No Orders Available
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        There are no orders available for delivery at the moment.
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-10 sm:space-y-12">
        <h2 className="text-2xl sm:text-3xl font-semibold">Delivery Orders</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-6">
            {orders.map(renderOrder)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryPage; 