import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist from Firestore when user logs in
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snapshot = await getDocs(
        collection(db, "wishlists", user.uid, "items"),
      );
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setWishlistItems(items);
    } catch (err) {
      console.warn("Failed to load wishlist:", err);
    }
    setLoading(false);
  };

  // Add product to wishlist
  const addToWishlist = async (product) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "wishlists", user.uid, "items", product.id), {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        addedAt: new Date().toISOString(),
      });
      setWishlistItems((prev) => [
        ...prev,
        {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
        },
      ]);
    } catch (err) {
      console.warn("Failed to add to wishlist:", err);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "wishlists", user.uid, "items", productId));
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.warn("Failed to remove from wishlist:", err);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
