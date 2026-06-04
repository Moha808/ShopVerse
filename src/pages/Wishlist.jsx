import { Link } from "react-router-dom";
import {
  HiOutlineHeart,
  HiOutlineTrash,
  HiOutlineShoppingCart,
} from "react-icons/hi";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatCurrency } from "../utils/helpers";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <HiOutlineHeart className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-surface-800 mb-2">
          Sign In to View Wishlist
        </h2>
        <p className="text-surface-500 mb-6">
          Save your favorite items for later.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <HiOutlineHeart className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-surface-800 mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-surface-500 mb-6">
          Explore products and save your favorites!
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleMoveToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      images: [item.image],
      stock: 99,
    });
    removeFromWishlist(item.id);
    toast.success("Moved to cart!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 mb-8">
        My Wishlist ({wishlistItems.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-surface-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link to={`/product/${item.id}`}>
              <div className="aspect-square bg-surface-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link
                to={`/product/${item.id}`}
                className="text-sm font-semibold text-surface-800 line-clamp-2 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
              <p className="text-lg font-bold text-surface-900 mt-2">
                {formatCurrency(item.price)}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  <HiOutlineShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    removeFromWishlist(item.id);
                    toast.success("Removed from wishlist");
                  }}
                  className="p-2.5 border border-surface-200 rounded-xl text-surface-400 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
