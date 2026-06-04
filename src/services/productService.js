/**
 * Product Service — Firestore CRUD operations for products
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase";
import { DEMO_PRODUCTS } from "../utils/seedData";

const COLLECTION = "products";

/**
 * Get all products (falls back to demo data if Firestore is empty/unavailable)
 */
export const getProducts = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    if (snapshot.empty) return DEMO_PRODUCTS;
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    console.warn("Firestore unavailable, using demo products");
    return DEMO_PRODUCTS;
  }
};

/**
 * Get a single product by ID
 */
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
    // Fallback to demo data
    return DEMO_PRODUCTS.find((p) => p.id === id) || null;
  } catch {
    return DEMO_PRODUCTS.find((p) => p.id === id) || null;
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("category", "==", category),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty)
      return DEMO_PRODUCTS.filter((p) => p.category === category);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return DEMO_PRODUCTS.filter((p) => p.category === category);
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async () => {
  try {
    const q = query(collection(db, COLLECTION), where("featured", "==", true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return DEMO_PRODUCTS.filter((p) => p.featured);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return DEMO_PRODUCTS.filter((p) => p.featured);
  }
};

/**
 * Search products by name
 */
export const searchProducts = async (searchTerm) => {
  // Firestore doesn't support full-text search — filter client-side
  const products = await getProducts();
  const term = searchTerm.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term),
  );
};

/**
 * Add a new product (admin)
 */
export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...productData,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...productData };
};

/**
 * Update a product (admin)
 */
export const updateProduct = async (id, data) => {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, data);
};

/**
 * Delete a product (admin)
 */
export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};

/**
 * Upload product image to Cloudinary
 */
export const uploadProductImage = async (file, productId) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing in .env");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  // Store inside a specific folder for organization
  formData.append("folder", `shopverse/products/${productId}`);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
