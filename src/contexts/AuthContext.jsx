import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { createUserProfile, getUserProfile } from "../services/userService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Register with email & password
  const register = async (email, password, name) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await sendEmailVerification(result.user);
    // Create Firestore user profile
    await createUserProfile(result.user.uid, {
      name,
      email,
      role: "customer",
      avatar: "",
      phone: "",
      addresses: [],
    });
    const profile = await getUserProfile(result.user.uid);
    setUserProfile(profile);
    return result.user;
  };

  // Login with email & password
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(result.user.uid);
    setUserProfile(profile);
    return result.user;
  };

  // Google sign-in — always use popup to avoid Safari ITP redirect issues
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // Create profile if first login
    const existing = await getUserProfile(result.user.uid);
    if (!existing) {
      await createUserProfile(result.user.uid, {
        name: result.user.displayName || "",
        email: result.user.email,
        role: "customer",
        avatar: result.user.photoURL || "",
        phone: "",
        addresses: [],
      });
    }
    const profile = await getUserProfile(result.user.uid);
    setUserProfile(profile);
    return result.user;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  // Password reset
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  // Check if user is admin
  const isAdmin = userProfile?.role === "admin";

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    setUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
