import { Navigate } from "react-router-dom";
import { useAuthUser } from "../../lib/useAuthUser";

export default function AdminRoute({ children }) {
  const { user, role, loading } = useAuthUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}
