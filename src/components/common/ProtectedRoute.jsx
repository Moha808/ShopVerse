import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Loader from "../common/Loader";

/**
 * Protects routes that require authentication.
 * Redirects to /login if user is not signed in.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Loading..." />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
