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
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button type="submit" disabled={loading} className="w-full border p-2">
          {loading ? "Registering..." : "Register"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full border border-black text-black p-2 mt-2"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
