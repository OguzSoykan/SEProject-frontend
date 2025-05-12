import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="text-6xl font-bold text-red-500 mb-4">401</div>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-neutral-200 mb-4">
        Unauthorized Access
      </h1>
      <p className="text-gray-600 dark:text-neutral-400 mb-8">
        You don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
} 