import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuthUser } from "../lib/useAuthUser";

export default function Navbar() {
  const { user, role, loading } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between max-sm:px-4 max-sm:py-3">
        <Link
          to="/"
          className="font-heading font-bold text-xl text-deepolive tracking-tight hover:text-softolive transition-colors max-sm:text-lg"
        >
          Tikumsu
        </Link>

        <div className="flex items-center gap-6 max-sm:gap-4">
          {!loading && user && (
            <Link
              to="/dashboard"
              className="font-body text-sm font-medium text-slate-700 hover:text-softolive transition-colors tracking-wide max-sm:text-xs"
            >
              Dashboard
            </Link>
          )}

          {!loading && role === "admin" && (
            <Link
              to="/admin"
              className="font-body text-sm font-medium text-slate-700 hover:text-softolive transition-colors tracking-wide max-sm:text-xs"
            >
              Admin
            </Link>
          )}

          {!loading && !user ? (
            <Link
              to="/login"
              className="bg-softolive text-white font-body font-semibold text-sm px-5 py-2 rounded-lg hover:bg-deepolive transition-colors tracking-wide max-sm:px-4 max-sm:py-1.5 max-sm:text-xs"
            >
              Masuk
            </Link>
          ) : (
            !loading && (
              <button
                onClick={handleLogout}
                className="font-body text-sm font-medium text-slate-700 hover:text-rusticbrown transition-colors tracking-wide max-sm:text-xs"
              >
                Keluar
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
