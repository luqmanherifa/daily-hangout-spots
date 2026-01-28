import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/navigation/Navbar";

import HomePage from "./pages/home/HomePage";
import SpotDetailPage from "./pages/spot/SpotDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UserDashboardPage from "./pages/dashboard/UserDashboardPage";
import AdminDashboardPage from "./pages/dashboard/AdminDashboardPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/spot/:id" element={<SpotDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
