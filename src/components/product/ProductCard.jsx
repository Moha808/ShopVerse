import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiHeart,
  HiStar,
} from "react-icons/hi";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency, calcDiscount } from "../../utils/helpers";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {
    id,
    name,
    price,
    comparePrice,
    images = [],
    rating = 0,
    reviewCount = 0,
    stock = 0,
    category,
  } = product;

  const image = images[0] || "";
  const discountPercent = comparePrice ? calcDiscount(comparePrice, price) : 0;
  const inWishlist = isInWishlist(id);
  const outOfStock = stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return toast.error("Out of stock");
    addToCart(product);
    toast.success("Added to cart!");
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return toast.error("Please sign in first");
    if (inWishlist) {
      removeFromWishlist(id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({ id, name, price, image });
      toast.success("Added to wishlist!");
    }
  };

  return (
    <Link
      to={`/product/${id}`}
      className="group flex flex-col bg-white rounded-2xl border border-surface-100 overflow-hidden hover:shadow-lg hover:shadow-surface-200/60 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-surface-100 overflow-hidden">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 skeleton" />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-100">
            <span className="text-surface-400 text-xs">No image</span>
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Badges */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-md">
            −{discountPercent}%
          </span>
        )}
        {outOfStock && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-surface-800 text-white text-[10px] font-bold rounded-md">
            Sold Out
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            inWishlist
              ? "bg-red-500 text-white shadow-md"
              : "bg-white/80 text-surface-500 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 shadow-sm"
          }`}
          aria-label="Wishlist"
        >
          {inWishlist ? (
            <HiHeart className="w-4 h-4" />
          ) : (
            <HiOutlineHeart className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {category && (
          <span className="text-[10px] font-medium text-primary-500 uppercase tracking-wider mb-1">
            {category}
          </span>
        )}

        <h3 className="text-sm font-semibold text-surface-800 leading-snug line-clamp-2 mb-auto">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <HiStar
                key={i}
                className={`w-3 h-3 ${
                  i < Math.round(rating) ? "text-amber-400" : "text-surface-200"
                }`}
              />
            ))}
          </div>
          {reviewCount > 0 && (
            <span className="text-[10px] text-surface-400 ml-0.5">
              ({reviewCount})
            </span>
          )}
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-2 mt-2.5">
          <div className="min-w-0">
            <span className="text-base font-bold text-surface-900">
              {formatCurrency(price)}
            </span>
            {comparePrice > price && (
              <span className="block text-xs text-surface-400 line-through">
                {formatCurrency(comparePrice)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              outOfStock
                ? "bg-surface-100 text-surface-300 cursor-not-allowed"
                : "bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white active:scale-90"
            }`}
            aria-label="Add to cart"
          >
            <HiOutlineShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
