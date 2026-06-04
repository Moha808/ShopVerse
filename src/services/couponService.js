/**
 * Coupon Service — Firestore operations for discount coupons
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
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION = "coupons";

/**
 * Validate and retrieve coupon details
 */
export const validateCoupon = async (code) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("code", "==", code.toUpperCase()),
      where("active", "==", true),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return { valid: false, message: "Invalid coupon code" };

    const coupon = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, message: "This coupon has expired" };
    }

    return { valid: true, coupon };
  } catch {
    return { valid: false, message: "Unable to validate coupon" };
  }
};

/**
 * Apply coupon discount to a total
 */
export const applyCouponDiscount = (total, coupon) => {
  if (!coupon) return total;

  if (coupon.minAmount && total < coupon.minAmount) {
    return total; // Minimum not met
  }

  if (coupon.type === "percent") {
    return total - (total * coupon.discount) / 100;
  }
  // Fixed amount
  return Math.max(0, total - coupon.discount);
};

/**
 * Get all coupons (admin)
 */
export const getAllCoupons = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
};

/**
 * Add a coupon (admin)
 */
export const addCoupon = async (couponData) => {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...couponData,
    code: couponData.code.toUpperCase(),
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...couponData };
};

/**
 * Update a coupon (admin)
 */
export const updateCoupon = async (id, data) => {
  await updateDoc(doc(db, COLLECTION, id), data);
};

/**
 * Delete a coupon (admin)
 */
export const deleteCoupon = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};
