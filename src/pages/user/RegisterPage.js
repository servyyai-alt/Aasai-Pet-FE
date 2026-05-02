import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiTropicalFish } from 'react-icons/gi';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../../assets/logo.png';
import company_logo from '../../assets/company_logo.png';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: FiUser },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', icon: FiMail },
    {
      key: 'phone',
      label: 'Phone',
      type: 'tel',
      placeholder: '+91 98765 43210',
      icon: FiPhone,
    },
  ];

  return (
    <div className="min-h-screen bg-ocean-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center mb-8">
            <Link to="/" className="flex items-center gap-2 group justify-center mb-4 p-1 rounded-xl">
              <div className="rounded-xl text-white group-hover:scale-110 transition-transform">
                <img src={logo} alt="AasaiPet Logo" className="w-13 h-11" />
              </div>
              <img
                src={company_logo}
                alt="AasaiPet Logo"
                className="w-30 h-8 hidden sm:block"
              />
            </Link>
            <h1 className="font-display text-3xl font-bold text-ocean-900">Create Account</h1>
            <p className="text-ocean-400 mt-1">Join the AasaiPet family</p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, icon: Icon }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-ocean-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={e => {
                      if (key === 'phone') {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 10) {
                          setForm(f => ({ ...f, phone: val }));
                        }
                      } else {
                        setForm(f => ({ ...f, [key]: e.target.value }));
                      }
                    }}
                    maxLength={key === 'phone' ? 10 : undefined}
                    required
                    className="input-field pl-10"
                  />
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300 w-4 h-4" />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-ocean-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPwd ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                  className="input-field pl-10 pr-10"
                />
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-ocean-300 w-4 h-4" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ocean-300"
                >
                  {showConfirmPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-ocean-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-ocean-700 font-semibold hover:text-ocean-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
