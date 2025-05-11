import { FC, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { menuService, MenuItem } from "services/menuService";
import { useCart } from "context/CartContext";
import NotifyAddToCart from "../NotifyAddToCart/NotifyAddToCart";

interface RestaurantMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: number;
  restaurantName: string;
}

const RestaurantMenuModal: FC<RestaurantMenuModalProps> = ({
  isOpen,
  onClose,
  restaurantId,
  restaurantName,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const [showNotify, setShowNotify] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchMenu = async () => {
        try {
          setLoading(true);
          const data = await menuService.getRestaurantMenu(restaurantId);
          setMenuItems(data);
          setError(null);
        } catch (err) {
          setError('Failed to load menu items');
        } finally {
          setLoading(false);
        }
      };

      fetchMenu();
    }
  }, [isOpen, restaurantId]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image
    });
    setSelectedItem(item);
    setShowNotify(true);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex justify-between items-center"
                  >
                    <span>{restaurantName} - Menu</span>
                    <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </Dialog.Title>

                  {loading ? (
                    <div className="mt-4 text-center">Loading...</div>
                  ) : error ? (
                    <div className="mt-4 text-center text-red-500">{error}</div>
                  ) : (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-neutral-700 rounded-lg shadow-md overflow-hidden"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                              {item.description}
                            </p>
                            <div className="mt-4 flex justify-between items-center">
                              <span className="text-lg font-bold text-primary-500">
                                ₺{item.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <NotifyAddToCart
        show={showNotify}
        onClose={() => setShowNotify(false)}
        productName={selectedItem?.name || ""}
        productImage={selectedItem?.image || ""}
      />
    </>
  );
};

export default RestaurantMenuModal; 