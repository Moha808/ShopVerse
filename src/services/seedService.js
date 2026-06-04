/**
 * Seed Service — Populates Firestore with initial demo data (products, coupons, and reviews)
 */
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { DEMO_PRODUCTS, DEMO_REVIEWS } from "../utils/seedData";

const DEMO_COUPONS = [
  {
    code: "WELCOME10",
    discount: 10,
    type: "percent",
    minAmount: 5000,
    active: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  {
    code: "SAVE5000",
    discount: 5000,
    type: "fixed",
    minAmount: 30000,
    active: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Seed the Firestore database with demo products, coupons, and product reviews.
 * Overwrites existing documents with matching IDs/codes to ensure a consistent test state.
 */
export const seedDatabase = async () => {
  // 1. Seed Products
  const productsCollection = collection(db, "products");
  for (const product of DEMO_PRODUCTS) {
    const docRef = doc(productsCollection, product.id);
    await setDoc(docRef, {
      ...product,
      createdAt: new Date().toISOString(),
    });
  }

  // 2. Seed Coupons
  const couponsCollection = collection(db, "coupons");
  for (const coupon of DEMO_COUPONS) {
    const docRef = doc(couponsCollection, coupon.code);
    await setDoc(docRef, {
      ...coupon,
      createdAt: new Date().toISOString(),
    });
  }

  // 3. Seed Reviews
  const reviewsCollection = collection(db, "reviews");
  for (const review of DEMO_REVIEWS) {
    const docRef = doc(reviewsCollection, review.id);
    await setDoc(docRef, {
      ...review,
      createdAt: new Date().toISOString(),
    });
  }
};
