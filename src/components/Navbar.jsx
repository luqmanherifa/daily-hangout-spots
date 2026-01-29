import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuthUser } from "../lib/useAuthUser";
import { useState, useEffect, useRef } from "react";
import {
  TikumsuIcon,
  DashboardIcon,
  ShieldIcon,
  LoginIcon,
  LogoutIcon,
  ChevronDownIcon,
} from "./icons";

export default function Navbar() {
  const { user, role, loading } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getCurrentLabel = () => {
    if (location.pathname === "/admin") {
      return { text: "Admin", Icon: ShieldIcon };
    }
    return { text: "Dashboard", Icon: DashboardIcon };
  };

  const currentLabel = getCurrentLabel();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between max-sm:px-4 max-sm:py-2.5">
        <Link
          to="/"
          className="font-heading font-bold text-lg text-deepolive tracking-tight hover:text-softolive max-sm:text-base flex items-center gap-2"
        >
          <TikumsuIcon className="w-4 h-4 text-softolive max-sm:w-3.5 max-sm:h-3.5" />
          Tikumsu
        </Link>

        <div className="flex items-center gap-3 max-sm:gap-2">
          {!loading && user && (
            <>
              {role === "admin" ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="font-body text-sm font-medium text-slate-700 hover:text-softolive tracking-wide max-sm:text-xs flex items-center gap-1 px-2 py-1"
                  >
                    <currentLabel.Icon className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3" />
                    <span className="max-sm:hidden">{currentLabel.text}</span>
                    <ChevronDownIcon className="w-3 h-3" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-softolive border-b border-slate-100"
                      >
                        <DashboardIcon className="w-3.5 h-3.5" />
                        Dashboard
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-softolive"
                      >
                        <ShieldIcon className="w-3.5 h-3.5" />
                        Admin
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/dashboard"
                  className="font-body text-sm font-medium text-slate-700 hover:text-softolive tracking-wide max-sm:text-xs flex items-center gap-1 px-2 py-1"
                >
                  <DashboardIcon className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3" />
                  <span className="max-sm:hidden">Dashboard</span>
                </Link>
              )}
            </>
          )}

          {!loading && !user ? (
            <Link
              to="/login"
              className="bg-softolive text-white font-body font-semibold text-sm px-4 py-1.5 rounded-md hover:bg-deepolive tracking-wide max-sm:px-3 max-sm:py-1 max-sm:text-xs flex items-center gap-1.5"
            >
              <LoginIcon className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3" />
              Masuk
            </Link>
          ) : (
            !loading && (
              <button
                onClick={handleLogout}
                className="font-body text-sm font-medium text-slate-700 hover:text-red-600 tracking-wide max-sm:text-xs flex items-center gap-1 px-2 py-1"
              >
                <LogoutIcon className="w-3.5 h-3.5 max-sm:w-3 max-sm:h-3" />
                <span className="max-sm:hidden">Keluar</span>
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
