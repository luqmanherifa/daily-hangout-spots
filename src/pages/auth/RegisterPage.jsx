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
    <div className="min-h-screen bg-warmcream flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-heading font-black text-4xl text-deepolive mb-3 tracking-tight max-sm:text-3xl">
            Gabung yuk! 🚀
          </h1>
          <p className="font-body text-base text-slate-600 tracking-wide max-sm:text-sm">
            Daftar sekarang dan mulai share spot favoritmu
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-slate-200 max-sm:p-6">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="font-body text-sm font-medium text-deepolive mb-2 block tracking-wide">
                Email
              </label>
              <input
                className="w-full border-2 border-slate-200 px-4 py-3.5 rounded-xl font-body text-base focus:outline-none focus:border-softolive transition-colors bg-slate-50 focus:bg-white tracking-wide"
                placeholder="nama@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="font-body text-sm font-medium text-deepolive mb-2 block tracking-wide">
                Password
              </label>
              <input
                className="w-full border-2 border-slate-200 px-4 py-3.5 rounded-xl font-body text-base focus:outline-none focus:border-softolive transition-colors bg-slate-50 focus:bg-white tracking-wide"
                type="password"
                placeholder="minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {errorMsg && (
              <div className="bg-rusticbrown/10 border-2 border-rusticbrown/30 rounded-xl p-4">
                <p className="font-body text-sm text-rusticbrown tracking-wide">
                  ⚠️{" "}
                  {errorMsg.includes("email-already-in-use")
                    ? "Email sudah terdaftar. Coba login ya!"
                    : errorMsg.includes("weak-password")
                      ? "Password terlalu lemah. Minimal 6 karakter!"
                      : errorMsg.includes("invalid-email")
                        ? "Format email tidak valid. Coba cek lagi!"
                        : "Gagal daftar. Coba lagi ya!"}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-deepolive text-warmcream font-body font-semibold text-base px-6 py-4 rounded-xl hover:bg-softolive transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed tracking-wide"
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="font-body text-sm text-slate-400">atau</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full border-2 border-softolive text-softolive font-body font-semibold text-base px-6 py-4 rounded-xl hover:bg-softolive hover:text-warmcream transition-colors tracking-wide"
          >
            Sudah Punya Akun? Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
