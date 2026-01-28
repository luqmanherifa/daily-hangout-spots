import { Navigate } from "react-router-dom";
import { useAuthUser } from "../lib/useAuthUser";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthUser();

  if (loading) {
    return children;
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
