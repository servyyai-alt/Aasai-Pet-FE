import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { GiTropicalFish } from "react-icons/gi";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../../assets/logo.png";
import company_logo from "../../assets/company_logo.png";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-ocean-gradient flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg,#1a0533 0%,#2d1b69 30%,#0d3b5e 65%,#0b4535 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center gap-2 group justify-center mb-4 p-1 rounded-xl">
              <div className="rounded-xl text-white group-hover:scale-110 transition-transform">
                <img src={logo} alt="AasaiPet Logo" className="w-13 h-11" />
              </div>
              {/* <span className="font-display font-bold text-xl text-ocean-900">Aasai<span className="text-aqua-500">Pet</span></span> */}
              <img
                src={company_logo}
                alt="AasaiPet Logo"
                className="w-30 h-8 hidden sm:block"
              />
            </Link>
            <h1 className="font-display text-3xl font-bold text-ocean-900">
              Welcome Back
            </h1>
            <p className="text-ocean-400 mt-1">
              Sign in to your AasaiPet account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  className="input-field pl-10"
                />
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300 w-4 h-4" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  className="input-field pl-10 pr-10"
                />
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300 w-4 h-4" />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ocean-300"
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center flex"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-ocean-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-ocean-700 font-semibold hover:text-ocean-500"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
