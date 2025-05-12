import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { authService } from "utils/authService";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  cuisine: string;
  avg_price: number;
  rating: number;
}

export default function RestaurantAdminPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    cuisine: "",
    avg_price: 0,
    rating: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!(authService.isAdmin() || authService.isRestaurantAdmin())) {
      navigate("/unauthorized");
    }
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:8080/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      setError("Restoranlar alınamadı");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (restaurant?: Restaurant) => {
    if (restaurant) {
      setSelectedRestaurant(restaurant);
      setFormData({
        name: restaurant.name,
        description: restaurant.description,
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        avg_price: restaurant.avg_price,
        rating: restaurant.rating,
      });
    } else {
      setSelectedRestaurant(null);
      setFormData({
        name: "",
        description: "",
        location: "",
        cuisine: "",
        avg_price: 0,
        rating: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "avg_price" || name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedRestaurant) {
        await axios.put(`http://localhost:8080/admin/restaurant/${selectedRestaurant.id}`, formData);
      } else {
        await axios.post("http://localhost:8080/admin/restaurant", formData);
      }
      setIsModalOpen(false);
      fetchRestaurants();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu restoranı silmek istiyor musunuz?")) {
      try {
        await axios.delete(`http://localhost:8080/admin/restaurant/${id}`);
        fetchRestaurants();
      } catch (err) {
        console.error("Deletion error:", err);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Restaurant Management</h1>
      <button
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => openModal()}
      >
        Add New Restaurant
      </button>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {restaurants.map((res) => (
          <div key={res.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold">{res.name}</h2>
            <p>{res.description}</p>
            <p className="text-sm text-gray-500">{res.location} | {res.cuisine}</p>
            <p className="text-sm">Average Price: {res.avg_price} ₺ | Rating: {res.rating.toFixed(1)}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => openModal(res)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDelete(res.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow w-full max-w-md">
              <Dialog.Title className="text-lg font-bold mb-4">
                {selectedRestaurant ? "Edit Restaurant" : "New Restaurant"}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  name="cuisine"
                  placeholder="Cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  name="avg_price"
                  placeholder="Average Price"
                  type="number"
                  value={formData.avg_price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  name="rating"
                  placeholder="Rating"
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setIsModalOpen(false)}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
