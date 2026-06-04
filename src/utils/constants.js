/**
 * Application-wide constants
 */

export const PRODUCT_CATEGORIES = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "home", name: "Home & Living", icon: "🏠" },
  { id: "beauty", name: "Beauty & Health", icon: "💄" },
  { id: "sports", name: "Sports & Outdoors", icon: "⚽" },
  { id: "books", name: "Books & Media", icon: "📚" },
  { id: "toys", name: "Toys & Games", icon: "🎮" },
  { id: "grocery", name: "Grocery", icon: "🛒" },
];

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export const ORDER_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "popular", label: "Most Popular" },
];

export const ITEMS_PER_PAGE = 12;

export const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
