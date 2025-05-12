import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Input from "shared/Input/Input";
import { useCart, CartItem } from "context/CartContext";
import { orderService } from "services/orderService";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Check if all items are from the same restaurant
    const firstRestaurantId = items[0].restaurantId;
    const allSameRestaurant = items.every(item => item.restaurantId === firstRestaurantId);
    
    if (!allSameRestaurant) {
      toast.error("All items must be from the same restaurant");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        address: address,
        items: items.map((item) => ({
          product_id: parseInt(item.id),
          quantity: item.quantity
        })),
        restaurant_id: parseInt(firstRestaurantId)
      };

      await orderService.placeOrder(orderData);
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (error: any) {
      console.error('Order placement error:', error);
      const errorMessage = error.response?.data?.message || "Failed to place order. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = (item: CartItem, index: number) => {
    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-semibold">{item.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="text-lg font-semibold text-primary-500">
                ₺{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderEmptyCart = () => (
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Your Cart is Empty
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Looks like you haven't added any items to your cart yet. Start exploring our restaurants and add some delicious food to your cart!
      </p>
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Browse Restaurants
      </Link>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="nc-CheckoutPage">
        <Helmet>
          <title>Checkout || Food Ordering App</title>
        </Helmet>

        <main className="container py-16 lg:pb-28 lg:pt-20">
          <div className="mb-16">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Checkout
            </h2>
            <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
              <Link to="/" className="">
                Homepage
              </Link>
              <span className="text-xs mx-1 sm:mx-1.5">/</span>
              <span className="underline">Checkout</span>
            </div>
          </div>

          {renderEmptyCart()}
        </main>
      </div>
    );
  }

  return (
    <div className="nc-CheckoutPage">
      <Helmet>
        <title>Checkout || Food Ordering App</title>
      </Helmet>

      <main className="container py-16 lg:pb-28 lg:pt-20">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Checkout
          </h2>
          <div className="block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400">
            <Link to="/" className="">
              Homepage
            </Link>
            <span className="text-xs mx-1 sm:mx-1.5">/</span>
            <span className="underline">Checkout</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">
            <div className="space-y-8">
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sizeClass="h-12 px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16"></div>

          <div className="w-full lg:w-[36%]">
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700">
              {items.map(renderProduct)}
            </div>

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700">
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Order total</span>
                <span>₺{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <ButtonPrimary
              className="mt-8 w-full"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Confirm Order"}
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
