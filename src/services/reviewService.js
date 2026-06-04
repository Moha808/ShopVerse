/**
 * Review Service — Firestore operations for product reviews
 */
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "reviews";

/**
 * Get reviews for a specific product
 * @param {string} productId - The product ID to query reviews for
 * @returns {Promise<Array>} List of reviews from Firestore
 */
export const getReviews = async (productId) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("productId", "==", productId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching reviews from Firestore:", error);
    return [];
  }
};

/**
 * Add a new product review
 * @param {Object} reviewData - Review document content (productId, userId, userName, rating, comment)
 * @returns {Promise<Object>} The newly created review document with generated ID
 */
export const addReview = async (reviewData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...reviewData,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...reviewData };
};
