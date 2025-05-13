import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { authService } from "utils/authService";
import { useNavigate } from "react-router-dom";
import AdminCard from "components/AdminCard/AdminCard";
import NcImage from "shared/NcImage/NcImage";

/* ----------------------------------------------------------------------------------------------
   Types
------------------------------------------------------------------------------------------------*/
interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  cuisine: string;
  avg_price: number;
  rating: number;
  image_url: string;
}

interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  price: number;
  image_url: string;
}

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

/* ----------------------------------------------------------------------------------------------
   Component
------------------------------------------------------------------------------------------------*/
export default function RestaurantAdminPage() {
  /* --------------------------- state (restaurants & orders) ----------------------------------*/
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------- state (restaurant form modal) ---------------------------------*/
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    description: "",
    location: "",
    cuisine: "",
    avg_price: 0,
    rating: 0,
  });
  const [restaurantImage, setRestaurantImage] = useState<File | null>(null);

  /* --------------------------- state (menu modal) --------------------------------------------*/
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [currentRestaurantForMenu, setCurrentRestaurantForMenu] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuView, setMenuView] = useState<"list" | "form">("list");
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState({ name: "", price: 0 });
  const [menuImage, setMenuImage] = useState<File | null>(null);

  const navigate = useNavigate();

  /* ------------------------------------------------------------------------------------------*/
  useEffect(() => {
    if (!(authService.isAdmin() || authService.isRestaurantAdmin())) {
      navigate("/unauthorized");
    }
    fetchRestaurants();
    fetchOrders();
  }, []);

  /* --------------------------- API calls -----------------------------------------------------*/
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:8080/restaurants");
      setRestaurants(
        res.data.map((r: Restaurant) => ({
          ...r,
          image_url: r.image_url?.startsWith("http")
            ? r.image_url
            : `http://localhost:8080${r.image_url.startsWith("/") ? "" : "/"}${r.image_url}`,
        }))
      );
    } catch {
      setError("Failed to load restaurants");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/restaurant/orders");
      setOrders(res.data || []);
    } catch {
      setError("Failed to load orders");
    }
  };

  const fetchMenuItems = async (restaurant: Restaurant) => {
    try {
      setMenuLoading(true);
      const res = await axios.get(`http://localhost:8080/restaurants/${restaurant.id}/menu`);
      setMenuItems(
        (res.data || []).map((m: MenuItem) => ({
          ...m,
          image_url: m.image_url?.startsWith("http")
            ? m.image_url
            : `http://localhost:8080${m.image_url.startsWith("/") ? "" : "/"}${m.image_url}`,
        }))
      );
    } catch {
      setError("Failed to load menu items");
      setMenuItems([]);
    } finally {
      setMenuLoading(false);
    }
  };

  /* --------------------------- Handlers: Restaurant CRUD ------------------------------------*/
  const openRestaurantModal = (restaurant?: Restaurant) => {
    if (restaurant) {
      setEditingRestaurant(restaurant);
      setRestaurantForm({
        name: restaurant.name,
        description: restaurant.description,
        location: restaurant.location,
        cuisine: restaurant.cuisine,
        avg_price: restaurant.avg_price,
        rating: restaurant.rating,
      });
    } else {
      setEditingRestaurant(null);
      setRestaurantForm({
        name: "",
        description: "",
        location: "",
        cuisine: "",
        avg_price: 0,
        rating: 0,
      });
    }
    setRestaurantImage(null);
    setIsRestaurantModalOpen(true);
  };

  const submitRestaurantForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(restaurantForm).forEach(([k, v]) => fd.append(k, v.toString()));
      if (restaurantImage) fd.append("image", restaurantImage);

      if (editingRestaurant) {
        await axios.put(`http://localhost:8080/admin/restaurant/${editingRestaurant.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:8080/admin/restaurant", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setIsRestaurantModalOpen(false);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteRestaurant = async (id: number) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await axios.delete(`http://localhost:8080/admin/restaurant/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
    }
  };

  /* --------------------------- Handlers: Menu CRUD ------------------------------------------*/
  const openMenuModal = (restaurant: Restaurant) => {
    setCurrentRestaurantForMenu(restaurant);
    setMenuView("list");
    setEditingMenuItem(null);
    setMenuForm({ name: "", price: 0 });
    setMenuImage(null);
    setIsMenuModalOpen(true);
    fetchMenuItems(restaurant);
  };

  const openEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuForm({ name: item.name, price: item.price });
    setMenuImage(null);
    setMenuView("form");
  };

  const openAddMenuItem = () => {
    setEditingMenuItem(null);
    setMenuForm({ name: "", price: 0 });
    setMenuImage(null);
    setMenuView("form");
  };

  const submitMenuForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRestaurantForMenu) return;
    try {
      if (editingMenuItem) {
        // PUT
        await axios.put(`http://localhost:8080/restaurant/menu/${editingMenuItem.id}`, {
          id: editingMenuItem.id,
          name: menuForm.name,
          price: menuForm.price,
          image_url: editingMenuItem.image_url,
          restaurant_id: currentRestaurantForMenu.id,
        });
      } else {
        // POST (multipart with image)
        const fd = new FormData();
        fd.append("restaurant_id", currentRestaurantForMenu.id.toString());
        fd.append("name", menuForm.name);
        fd.append("price", menuForm.price.toString());
        if (menuImage) fd.append("image", menuImage);
        await axios.post("http://localhost:8080/restaurant/menu", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      // reload list
      await fetchMenuItems(currentRestaurantForMenu);
      setMenuView("list");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMenuItem = async (item: MenuItem) => {
    if (!currentRestaurantForMenu) return;
    if (!window.confirm("Delete this menu item?")) return;
    try {
      await axios.delete(`http://localhost:8080/restaurant/menu/${item.id}`);
      await fetchMenuItems(currentRestaurantForMenu);
    } catch (err) {
      console.error(err);
    }
  };

  /* --------------------------- UI render helpers --------------------------------------------*/
  const RestaurantFormInput = (
    name: string,
    label: string,
    type: "text" | "number" = "text"
  ) => (
    <div>
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={(restaurantForm as any)[name]}
        onChange={(e) =>
          setRestaurantForm((prev) => ({ ...prev, [name]: type === "number" ? Number(e.target.value) : e.target.value }))
        }
        className="block w-full text-sm rounded-lg border border-gray-300 bg-gray-50 focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white"
        required
      />
    </div>
  );

  const MenuFormInput = (
    name: "name" | "price",
    label: string,
    type: "text" | "number" = "text"
  ) => (
    <div>
      <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={(menuForm as any)[name]}
        onChange={(e) => setMenuForm((prev) => ({ ...prev, [name]: type === "number" ? Number(e.target.value) : e.target.value }))}
        className="block w-full text-sm rounded-lg border border-gray-300 bg-gray-50 focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white"
        required
      />
    </div>
  );

  /* --------------------------- JSX -----------------------------------------------------------*/
  if (pageLoading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Management</h1>
        <div className="flex gap-3">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg"
            onClick={() => navigate("/restaurant-orders")}
          >
            Orders
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
            onClick={() => openRestaurantModal()}
          >
            <PlusIcon className="w-5 h-5" /> Add Restaurant
          </button>
        </div>
      </div>

      {/* restaurant grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {restaurants.map((r) => (
          <AdminCard
            key={r.id}
            title={r.name}
            subtitle={r.cuisine}
            description={r.description}
            imageUrl={r.image_url}
            metadata={[
              { label: "Location", value: r.location },
              { label: "Average Price", value: `₺${r.avg_price}` },
              { label: "Rating", value: r.rating.toFixed(1) },
            ]}
            actions={[
              { label: "Edit", variant: "primary", onClick: () => openRestaurantModal(r) },
              { label: "Delete", variant: "danger", onClick: () => deleteRestaurant(r.id) },
              { label: "Menu Edit", variant: "primary", onClick: () => openMenuModal(r) },
            ]}
            className="h-full"
          />
        ))}
      </div>

      {/* ---------------- Restaurant FORM Modal ----------------- */}
      <Transition appear show={isRestaurantModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsRestaurantModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-lg bg-white dark:bg-neutral-800 rounded-xl shadow p-6 space-y-4">
              <Dialog.Title className="text-lg font-semibold">
                {editingRestaurant ? "Edit Restaurant" : "New Restaurant"}
              </Dialog.Title>
              <form onSubmit={submitRestaurantForm} className="space-y-4">
                {RestaurantFormInput("name", "Name")}
                {RestaurantFormInput("description", "Description")}
                {RestaurantFormInput("location", "Location")}
                {RestaurantFormInput("cuisine", "Cuisine")}
                {RestaurantFormInput("avg_price", "Average Price", "number")}
                {RestaurantFormInput("rating", "Rating", "number")}

                {/* image */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setRestaurantImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsRestaurantModalOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg">
                    Save
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* ---------------- MENU Modal ----------------- */}
      <Transition appear show={isMenuModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsMenuModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-xl shadow p-6">
              {/* header */}
              <div className="flex items-center justify-between mb-6">
                <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
                  {menuView === "list" ? "Menu Items" : editingMenuItem ? "Edit Menu Item" : "Add Menu Item"}
                </Dialog.Title>
                {menuView === "list" ? (
                  <button
                    className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                    onClick={openAddMenuItem}
                  >
                    <PlusIcon className="w-4 h-4" /> Add
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600"
                    onClick={() => setMenuView("list")}
                  >
                    <ArrowLeftIcon className="w-4 h-4" /> Back
                  </button>
                )}
              </div>

              {/* LIST VIEW */}
              {menuView === "list" && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {menuLoading ? (
                    <div className="text-center col-span-full py-10">Loading…</div>
                  ) : menuItems.length === 0 ? (
                    <div className="text-center col-span-full py-10">No menu items.</div>
                  ) : (
                    menuItems.map((item) => (
                      <div key={item.id} className="relative group border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                        <NcImage src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
                        <div className="p-3 space-y-1">
                          <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-primary-500 text-sm font-medium">₺{item.price.toFixed(2)}</p>
                        </div>
                        {/* actions */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditMenuItem(item)} className="p-1 rounded-full bg-white hover:bg-gray-100 shadow">
                            <PencilSquareIcon className="w-4 h-4 text-gray-700" />
                          </button>
                          <button onClick={() => deleteMenuItem(item)} className="p-1 rounded-full bg-white hover:bg-gray-100 shadow">
                            <TrashIcon className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* FORM VIEW */}
              {menuView === "form" && (
                <form onSubmit={submitMenuForm} className="space-y-4">
                  {MenuFormInput("name", "Name")}
                  {MenuFormInput("price", "Price", "number")}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setMenuImage(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 dark:bg-neutral-700 dark:border-neutral-600" onClick={() => setMenuView("list")}>Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg">Save</button>
                  </div>
                </form>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
