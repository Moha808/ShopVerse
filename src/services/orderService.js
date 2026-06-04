/**
 * Order Service — Firestore operations for orders
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "orders";

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...orderData,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...orderData };
};

/**
 * Get orders for a specific user
 */
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
};

/**
 * Get all orders (admin)
 */
export const getAllOrders = async () => {
  try {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (orderId) => {
  const docRef = doc(db, COLLECTION, orderId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
  return null;
};

/**
 * Update order status (admin)
 */
export const updateOrderStatus = async (orderId, status) => {
  const docRef = doc(db, COLLECTION, orderId);
  await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
};
