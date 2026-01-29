import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerWithEmail } from "../../lib/authService";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { user, error } = await registerWithEmail(email, password);

    if (error) {
      setErrorMsg(error.message || "Register gagal");
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-deepolive mb-2 tracking-tight max-sm:text-2xl">
              Daftar di Tikumsu
            </h1>
            <p className="font-body text-sm text-slate-600 tracking-wide">
              Buat akun dan mulai berbagi spot favorit
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 max-sm:p-5">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="font-body text-sm font-medium text-slate-700 mb-2 block tracking-wide">
                  Email
                </label>
                <input
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg font-body text-sm focus:outline-none focus:border-softolive transition-colors bg-white tracking-wide placeholder:text-slate-400"
                  placeholder="nama@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-sm font-medium text-slate-700 tracking-wide">
                    Password
                  </label>
                  <span className="font-body text-xs text-slate-500 tracking-wide">
                    Min. 6 karakter
                  </span>
                </div>
                <input
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-lg font-body text-sm focus:outline-none focus:border-softolive transition-colors bg-white tracking-wide placeholder:text-slate-400"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="font-body text-xs text-red-700 tracking-wide">
                    {errorMsg.includes("email-already-in-use")
                      ? "Email sudah terdaftar"
                      : errorMsg.includes("weak-password")
                        ? "Password minimal 6 karakter"
                        : errorMsg.includes("invalid-email")
                          ? "Format email tidak valid"
                          : "Gagal mendaftar, coba lagi"}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-softolive text-white font-body font-semibold text-sm px-6 py-3 rounded-lg hover:bg-deepolive transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed tracking-wide"
              >
                {loading ? "Memproses..." : "Daftar"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="font-body text-xs text-slate-400 tracking-wide">
                atau
              </span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full border border-slate-300 text-slate-700 font-body font-semibold text-sm px-6 py-3 rounded-lg hover:border-softolive hover:text-softolive transition-colors tracking-wide"
            >
              Sudah punya akun? Masuk
            </button>
          </div>

          <p className="text-center mt-6 font-body text-xs text-slate-500 tracking-wide">
            Dengan mendaftar, kamu setuju dengan syarat dan ketentuan kami
          </p>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-6 max-sm:px-4 max-sm:py-5">
          <div className="text-center font-body text-sm text-slate-600 tracking-wide">
            © 2026{" "}
            <a
              href="https://github.com/Spesialis-Ngopi-Dadakan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-softolive hover:underline transition-colors"
            >
              Spesialis Ngopi Dadakan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
