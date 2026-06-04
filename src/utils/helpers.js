/**
 * Format a number as currency (NGN by default)
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: NGN)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Truncate text to a max length
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

/**
 * Generate a random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

/**
 * Format a Firestore timestamp or date string
 */
export const formatDate = (date) => {
  if (!date) return "";
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Calculate discount percentage
 */
export const calcDiscount = (original, sale) => {
  if (!original || !sale || original <= sale) return 0;
  return Math.round(((original - sale) / original) * 100);
};

/**
 * Get star rating array for rendering
 */
export const getStarArray = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) stars.push("full");
  if (hasHalf) stars.push("half");
  while (stars.length < 5) stars.push("empty");
  return stars;
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
