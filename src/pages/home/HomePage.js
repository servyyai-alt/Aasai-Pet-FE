import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeaturedProducts, fetchCategories } from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { GiTropicalFish, GiFishingHook, GiAquarium } from 'react-icons/gi';
import { FiArrowRight, FiTruck, FiShield, FiStar, FiRefreshCw } from 'react-icons/fi';
import { MdOutlinePets } from 'react-icons/md';

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fp, fc] = await Promise.all([fetchFeaturedProducts(), fetchCategories()]);
        setFeatured(fp.data);
        setCategories(fc.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const categoryIcons = { fish: GiTropicalFish, food: GiFishingHook, motors: GiAquarium, accessories: MdOutlinePets };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-ocean-gradient overflow-hidden flex items-center wave-decoration">
        {/* Animated bubbles */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/10 animate-float"
            style={{ width: `${20 + i * 15}px`, height: `${20 + i * 15}px`, left: `${10 + i * 11}%`, bottom: `${10 + (i % 4) * 20}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${3 + i}s` }} />
        ))}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
                <span className="w-2 h-2 bg-aqua-300 rounded-full animate-pulse"></span>
                Premium Aquatic Store
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Dive Into<br />
                <span className="text-aqua-300">Aquatic</span><br />
                Paradise 🐟
              </h1>
              <p className="text-ocean-100 text-lg mb-8 max-w-lg leading-relaxed">
                Discover premium fish, aquarium equipment, fish food, and accessories. Everything your aquatic pets deserve, delivered to your door.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="bg-white text-ocean-800 font-bold px-8 py-4 rounded-2xl hover:bg-aqua-50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex items-center gap-2">
                  Shop Now <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/products?featured=true" className="bg-white/10 backdrop-blur border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
                  View Featured
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[['500+', 'Products'], ['10K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <div className="font-display text-3xl font-bold text-aqua-300">{val}</div>
                    <div className="text-ocean-200 text-sm">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hidden lg:flex justify-center items-center relative">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute inset-8 bg-white/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <GiAquarium className="w-48 h-48 text-white/60 animate-float" />
                </div>
                <GiTropicalFish className="absolute top-4 right-0 w-16 h-16 text-aqua-300 animate-wave" />
                <GiTropicalFish className="absolute bottom-8 left-0 w-10 h-10 text-ocean-200 animate-wave" style={{ animationDelay: '1s', transform: 'scaleX(-1)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: FiTruck, title: 'Free Shipping', sub: 'On orders above ₹999', color: 'text-ocean-500' },
              { icon: FiShield, title: 'Secure Payment', sub: 'Razorpay protected', color: 'text-aqua-500' },
              { icon: FiStar, title: 'Quality Assured', sub: 'Premium products only', color: 'text-amber-500' },
              { icon: FiRefreshCw, title: 'Easy Returns', sub: '7-day return policy', color: 'text-green-500' },
            ].map(({ icon: Icon, title, sub, color }) => (
              <div key={title} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-ocean-50 transition-colors">
                <div className={`${color} bg-ocean-50 p-3 rounded-xl mb-3`}><Icon className="w-6 h-6" /></div>
                <h4 className="font-display font-bold text-ocean-900 text-sm">{title}</h4>
                <p className="text-ocean-400 text-xs mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-aqua-500 font-medium text-sm uppercase tracking-widest mb-1">Browse By</p>
            <h2 className="section-title">Categories</h2>
          </div>
          <Link to="/products" className="text-ocean-600 hover:text-ocean-400 flex items-center gap-1 text-sm font-medium">
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.length > 0 ? categories.map((cat, i) => {
            const Icon = categoryIcons[cat.slug] || GiTropicalFish;
            const gradients = ['from-ocean-600 to-aqua-500', 'from-aqua-600 to-ocean-400', 'from-ocean-800 to-aqua-600', 'from-aqua-800 to-ocean-600'];
            return (
              <Link key={cat._id} to={`/products?category=${cat._id}`}
                className={`relative overflow-hidden bg-gradient-to-br ${gradients[i % 4]} text-white p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-ocean-300/50 group`}>
                <Icon className="w-10 h-10 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-lg">{cat.name}</h3>
                <p className="text-white/70 text-sm mt-1">{cat.description || 'Shop now'}</p>
                <FiArrowRight className="absolute bottom-4 right-4 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          }) : [...Array(4)].map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-aqua-500 font-medium text-sm uppercase tracking-widest mb-1">Handpicked For You</p>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <Link to="/products" className="text-ocean-600 hover:text-ocean-400 flex items-center gap-1 text-sm font-medium">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-ocean-400">
              <GiTropicalFish className="w-16 h-16 mx-auto mb-4 animate-float" />
              <p>No featured products yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-ocean-gradient relative overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/5 animate-float"
            style={{ width: `${100 + i * 50}px`, height: `${100 + i * 50}px`, right: `${i * 20}%`, top: `${i * 15}%`, animationDelay: `${i}s` }} />
        ))}
        <div className="max-w-3xl mx-auto text-center px-4 relative z-10">
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Build Your Dream Aquarium?</h2>
          <p className="text-ocean-100 text-lg mb-8">Join thousands of aquatic enthusiasts who trust AquaMart for their aquarium needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-white text-ocean-800 font-bold px-8 py-4 rounded-2xl hover:bg-aqua-50 transition-all hover:-translate-y-1 shadow-xl">
              Shop Now
            </Link>
            <Link to="/register" className="bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
