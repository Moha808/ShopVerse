import { createContext, useContext, useState, useEffect, useRef } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CART_STORAGE_KEY = "shopverse_cart";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  // Sync cart to localStorage every time it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const prevUserRef = useRef(null);

  // Sync cart with Firestore when user logs in
  useEffect(() => {
    if (user) {
      syncCartWithFirestore();
    } else if (prevUserRef.current && !user) {
      // User logged out, clear local cart state
      setCartItems([]);
      setCoupon(null);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
    prevUserRef.current = user;
  }, [user]);

  const syncCartWithFirestore = async () => {
    if (!user) return;
    try {
      const cartRef = doc(db, "carts", user.uid);
      const snapshot = await getDoc(cartRef);
      if (snapshot.exists()) {
        const firestoreItems = snapshot.data().items || [];
        // Merge local cart with Firestore cart
        const merged = mergeCartItems(cartItems, firestoreItems);
        setCartItems(merged);
        await setDoc(cartRef, {
          items: merged,
          updatedAt: new Date().toISOString(),
        });
      } else if (cartItems.length > 0) {
        // Save local cart to Firestore
        await setDoc(cartRef, {
          items: cartItems,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Cart sync failed:", err);
    }
  };

  const mergeCartItems = (local, remote) => {
    const map = new Map();
    remote.forEach((item) => map.set(item.id, item));
    local.forEach((item) => {
      if (map.has(item.id)) {
        map.get(item.id).quantity += item.quantity;
      } else {
        map.set(item.id, item);
      }
    });
    return Array.from(map.values());
  };

  const saveToFirestore = async (items) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "carts", user.uid), {
        items,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Failed to save cart:", err);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        updated = [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "",
            quantity,
            stock: product.stock,
          },
        ];
      }
      saveToFirestore(updated);
      return updated;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== productId);
      saveToFirestore(updated);
      return updated;
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
      saveToFirestore(updated);
      return updated;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    saveToFirestore([]);
    setCoupon(null);
  };

  // Cart calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const discount = coupon
    ? coupon.type === "percent"
      ? (subtotal * coupon.discount) / 100
      : Math.min(coupon.discount, subtotal)
    : 0;

  const total = Math.max(0, subtotal - discount);

  const value = {
    cartItems,
    coupon,
    setCoupon,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
