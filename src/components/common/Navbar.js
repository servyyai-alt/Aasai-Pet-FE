import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-ocean-200/50' : 'bg-white border-b border-ocean-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-ocean-gradient p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
              <GiTropicalFish className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl text-ocean-900">Aasai<span className="text-aqua-500">Pet</span></span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search fish, food, accessories..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 border-2 border-ocean-100 rounded-xl focus:outline-none focus:border-ocean-400 text-sm bg-ocean-50"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-ocean-400 hover:text-ocean-600">
                <FiSearch className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="nav-link text-sm">Shop</Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-ocean-600 hover:text-ocean-400 transition-colors">
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-aqua-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 bg-ocean-50 hover:bg-ocean-100 px-3 py-2 rounded-xl transition-colors">
                  <div className="w-7 h-7 bg-ocean-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-ocean-800 max-w-[80px] truncate">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-ocean-100 py-2 animate-fade-in">
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-ocean-700 hover:bg-ocean-50">
                      <FiUser className="w-4 h-4" /> My Profile
                    </Link>
                    <Link to="/dashboard/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-ocean-700 hover:bg-ocean-50">
                      <FiPackage className="w-4 h-4" /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-aqua-600 hover:bg-aqua-50 font-medium">
                        <FiSettings className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-ocean-100" />
                    <button onClick={() => { logout(); setDropdownOpen(false); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-ocean-600">
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-aqua-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-ocean-600">
              {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-ocean-100 px-4 py-4 space-y-3 animate-slide-up">
          <form onSubmit={handleSearch} className="flex">
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-ocean-200 rounded-l-lg text-sm focus:outline-none" />
            <button type="submit" className="px-3 py-2 bg-ocean-600 text-white rounded-r-lg"><FiSearch /></button>
          </form>
          <Link to="/products" className="block nav-link py-2">Shop</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block nav-link py-2">My Profile</Link>
              <Link to="/dashboard/orders" className="block nav-link py-2">My Orders</Link>
              {user.role === 'admin' && <Link to="/admin" className="block text-aqua-600 font-medium py-2">Admin Panel</Link>}
              <button onClick={logout} className="block text-red-500 py-2">Logout</button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 text-center">Login</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
