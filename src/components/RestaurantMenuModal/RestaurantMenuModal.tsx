import { FC, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { menuService, MenuItem } from "services/menuService";
import { useCart } from "context/CartContext";
import NotifyAddToCart from "../NotifyAddToCart/NotifyAddToCart";
import NcImage from "shared/NcImage/NcImage";

interface RestaurantMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
  restaurantName: string;
  restaurantImage?: string;
  restaurantLocation?: string;
  restaurantDescription?: string;
  restaurantRating?: number; // 0‑5
  restaurantAvgPrice?: number; // average price per person
}

/**
 * Modal that displays restaurant info and its menu items in a modern card layout.
 */
const RestaurantMenuModal: FC<RestaurantMenuModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
  restaurantImage,
  restaurantLocation,
  restaurantDescription,
  restaurantRating,
  restaurantAvgPrice,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const [showNotify, setShowNotify] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  /* ------------------------------------------------------------------------------------------ */
  useEffect(() => {
    if (!isOpen) return;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await menuService.getRestaurantMenu(restaurantId);
        setMenuItems(data || []);
        setError(null);
      } catch {
        setMenuItems([]);
        setError("Failed to load menu items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [isOpen, restaurantId]);

  /* ------------------------------------------------------------------------------------------ */
  const handleAddToCart = (item: MenuItem) => {
    const added = addItem({
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image_url,
      restaurantId: item.restaurant_id.toString(),
      restaurantName,
    });

    if (added) {
      setSelectedItem(item);
      setShowNotify(true);
    }
  };

  /* ------------------------------------------------------------------------------------------ */
  const renderMenuContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center py-12">
          <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-300">
            Loading menu items…
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      );
    }

    if (!menuItems.length) {
      return (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-300">
            No menu items available at the moment.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            Please check back later.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-lg transition-shadow"
          >
            {/* image */}
            <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
              <NcImage
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* name */}
            <h4 className="text-md font-semibold text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-2 text-center">
              {item.name}
            </h4>

            {/* price */}
            <div className="text-lg font-bold text-primary-600 text-center mb-4">
              ₺{item.price.toFixed(2)}
            </div>

            {/* action */}
            <button
              onClick={() => handleAddToCart(item)}
              className="mt-auto w-full py-2 rounded-full bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 text-white text-sm font-semibold shadow"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    );
  };

  /* ------------------------------------------------------------------------------------------ */
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          {/* backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-xl transform transition-all">
                  {/* close btn */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>

                  {/* Hero header */}
                  <div className="relative">
                    <NcImage
                      src={restaurantImage || "/images/restaurant-placeholder.jpg"}
                      alt={restaurantName}
                      className="h-60 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
                    <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                      <h2 className="text-2xl sm:text-3xl font-bold">{restaurantName}</h2>
                      {restaurantLocation && (
                        <div className="flex items-center gap-1 text-sm">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{restaurantLocation}</span>
                        </div>
                      )}
                      {restaurantDescription && (
                        <p className="text-sm opacity-90 max-w-xl line-clamp-2">
                          {restaurantDescription}
                        </p>
                      )}
                      {(restaurantRating !== undefined || restaurantAvgPrice !== undefined) && (
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-medium">
                          {restaurantRating !== undefined && (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-5 h-5 ${i < restaurantRating ? "text-yellow-400" : "text-white/30"}`}
                                />
                              ))}
                              <span>{restaurantRating.toFixed(1)}</span>
                            </div>
                          )}
                          {restaurantAvgPrice !== undefined && (
                            <span>Average price: ₺{restaurantAvgPrice.toFixed(2)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 space-y-8">
                    {renderMenuContent()}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-primary-500 hover:bg-primary-600 px-6 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={onClose}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Toast notification */}
      <NotifyAddToCart
        show={showNotify}
        onClose={() => setShowNotify(false)}
        productName={selectedItem?.name || ""}
        productImage={selectedItem?.image_url || ""}
      />
    </>
  );
};

export default RestaurantMenuModal;
