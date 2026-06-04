import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-surface-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-surface-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
          >
            Go Home
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 border border-surface-200 text-surface-700 font-semibold rounded-xl hover:bg-surface-50 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
