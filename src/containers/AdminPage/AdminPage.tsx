import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import AdminCard from "components/AdminCard/AdminCard";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string;
  role_id: number;
  role_name: string;
}

interface EditUserData {
  first_name: string;
  last_name: string;
  password: string;
  role_id: number;
  username: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditUserData>({
    first_name: "",
    last_name: "",
    password: "",
    role_id: 1,
    username: "",
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/all");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      password: "", // Don't show current password
      role_id: user.role_id,
      username: user.username,
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "role_id" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await axios.put(`http://localhost:8080/user/${selectedUser.id}`, editFormData);
      setIsEditModalOpen(false);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    if (window.confirm(`Are you sure you want to delete user "${selectedUser.username}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/user/${selectedUser.id}`);
        setIsEditModalOpen(false);
        fetchUsers(); // Refresh the user list
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user");
      }
    }
  };

  const renderUserCard = (user: User) => {
    return (
      <AdminCard
        key={user.id}
        title={`${user.first_name} ${user.last_name}`}
        subtitle={user.username}
        metadata={[
          { label: 'Role', value: user.role_name },
          { label: 'Created', value: new Date(user.created_at).toLocaleDateString() }
        ]}
        actions={[
          {
            label: 'Edit User',
            onClick: () => handleUserClick(user),
            variant: 'primary'
          }
        ]}
        className="h-full"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map(renderUserCard)}
      </div>

      {/* Edit Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditModalOpen(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-neutral-200"
                  >
                    Edit User
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={editFormData.first_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={editFormData.last_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={editFormData.password}
                        onChange={handleInputChange}
                        placeholder="Leave blank to keep current password"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Role
                      </label>
                      <select
                        name="role_id"
                        value={editFormData.role_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-neutral-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-neutral-700 dark:text-white sm:text-sm"
                      >
                        <option value={1}>User</option>
                        <option value={2}>Admin</option>
                        <option value={3}>Restaurant Admin</option>
                        <option value={4}>Delivery Person</option>
                      </select>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button
                        type="button"
                        onClick={handleDeleteUser}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        Delete User
                      </button>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsEditModalOpen(false)}
                          className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-neutral-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-neutral-200 hover:bg-gray-200 dark:hover:bg-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
} 