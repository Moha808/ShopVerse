/**
 * User Service — Firestore operations for user profiles
 */
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const COLLECTION = "users";

/**
 * Create or update a user profile in Firestore
 */
export const createUserProfile = async (userId, userData) => {
  await setDoc(
    doc(db, COLLECTION, userId),
    {
      ...userData,
      createdAt: new Date().toISOString(),
    },
    { merge: true },
  );
};

/**
 * Get a user profile
 */
export const getUserProfile = async (userId) => {
  try {
    const snapshot = await getDoc(doc(db, COLLECTION, userId));
    if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() };
    return null;
  } catch {
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, data) => {
  await updateDoc(doc(db, COLLECTION, userId), data);
};

/**
 * Upload user profile avatar to Firebase Storage and update Firestore profile document.
 */
export const uploadAvatar = async (userId, file) => {
  const avatarRef = ref(storage, `avatars/${userId}/avatar_${Date.now()}.jpg`);
  await uploadBytes(avatarRef, file);
  const downloadURL = await getDownloadURL(avatarRef);
  await updateUserProfile(userId, { avatar: downloadURL });
  return downloadURL;
};

/**
 * Save a delivery address
 */
export const saveAddress = async (userId, address) => {
  const profile = await getUserProfile(userId);
  const addresses = profile?.addresses || [];
  addresses.push({ ...address, id: Date.now().toString() });
  await updateDoc(doc(db, COLLECTION, userId), { addresses });
};

/**
 * Delete a delivery address
 */
export const deleteAddress = async (userId, addressId) => {
  const profile = await getUserProfile(userId);
  const addresses = (profile?.addresses || []).filter(
    (a) => a.id !== addressId,
  );
  await updateDoc(doc(db, COLLECTION, userId), { addresses });
};
