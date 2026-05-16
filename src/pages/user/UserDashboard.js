import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { fetchMyOrders } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiPackage, FiSettings, FiLogOut, FiEdit2, FiSave } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

// Profile Section
const ProfileSection = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || {} });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch (e) { toast.error(e.message || 'Update failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-orange-950">My Profile</h2>
        <button onClick={() => editing ? handleSave() : setEditing(true)} className={editing ? 'btn-primary-coral flex items-center gap-2 text-sm' : 'btn-secondary-coral flex items-center gap-2 text-sm'}>
          {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : editing ? <><FiSave /> Save</> : <><FiEdit2 /> Edit</>}
        </button>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-coral-500 to-coral-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-coral-500/20">
          {user?.name[0].toUpperCase()}
        </div>
        <div>
          <h3 className="font-display font-bold text-xl text-orange-950">{user?.name}</h3>
          <p className="text-orange-500 text-sm">{user?.email}</p>
          <span className="badge bg-orange-100 text-orange-700 mt-1">{user?.role}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { label: 'Full Name', field: 'name', value: form.name },
          { label: 'Phone', field: 'phone', value: form.phone },
        ].map(({ label, field, value }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-orange-800 mb-1">{label}</label>
            {editing ? (
              <input className="input-field-coral" value={value} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
            ) : (
              <p className="px-4 py-3 bg-orange-50 rounded-xl text-orange-800">{value || '—'}</p>
            )}
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-orange-800 mb-1">City</label>
          {editing ? (
            <input className="input-field-coral" value={form.address.city || ''} onChange={e => setForm(f => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
          ) : (
            <p className="px-4 py-3 bg-orange-50 rounded-xl text-orange-800">{user?.address?.city || '—'}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-orange-800 mb-1">State</label>
          {editing ? (
            <input className="input-field-coral" value={form.address.state || ''} onChange={e => setForm(f => ({ ...f, address: { ...f.address, state: e.target.value } }))} />
          ) : (
            <p className="px-4 py-3 bg-orange-50 rounded-xl text-orange-800">{user?.address?.state || '—'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Orders Section
const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusColors = { Pending: 'bg-amber-100 text-amber-700', Processing: 'bg-blue-100 text-blue-700', Shipped: 'bg-ocean-100 text-ocean-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };

  useEffect(() => {
    fetchMyOrders().then(r => { setOrders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-xl" />)}</div>;

  return (
    <div className="card p-6">
      <h2 className="font-display text-2xl font-bold text-orange-950 mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12 text-orange-500">
          <GiTropicalFish className="w-12 h-12 mx-auto mb-3 animate-float" />
          <p>No orders yet. Start shopping!</p>
          <Link to="/products" className="btn-primary-coral inline-flex mt-4 text-sm">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`} className="flex flex-wrap items-center gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0">
                {order.orderItems?.[0]?.image ? (
                  <img src={order.orderItems[0].image} alt={order.orderItems[0].name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-coral-500 to-coral-400">
                    <GiTropicalFish className="w-6 h-6 text-white/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-orange-400">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="font-medium text-orange-900 mt-0.5 line-clamp-1">
                  {order.orderItems?.[0]?.name || 'Order'}
                  {order.orderItems?.length > 1 ? ` + ${order.orderItems.length - 1} more` : ''}
                </p>
              </div>
              <span className={`badge px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
              <div className="text-right">
                <p className="font-bold text-orange-900">₹{order.totalPrice?.toLocaleString()}</p>
                <p className="text-xs text-orange-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Dashboard
const UserDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', label: 'Profile', icon: FiUser, exact: true },
    { path: '/dashboard/orders', label: 'Orders', icon: FiPackage },
    // { path: '/dashboard/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="card p-4">
            <div className="flex flex-col items-center text-center p-4 border-b border-orange-100 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-coral-500 to-coral-400 rounded-full flex items-center justify-center text-white text-xl font-bold mb-2 shadow-md shadow-coral-500/20">
                {user?.name[0].toUpperCase()}
              </div>
              <p className="font-display font-bold text-orange-950 text-sm">{user?.name}</p>
              <p className="text-orange-500 text-xs truncate w-full">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ path, label, icon: Icon, exact }) => {
                const active = exact ? location.pathname === path : location.pathname.startsWith(path);
                return (
                  <Link key={path} to={path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-coral-600 text-white shadow-sm' : 'text-coral-600 hover:bg-orange-50'}`}>
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                );
              })}
              <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                <FiLogOut className="w-4 h-4" /> Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">
          <Routes>
            <Route path="/" element={<ProfileSection />} />
            <Route path="/orders" element={<OrdersSection />} />
            <Route path="/settings" element={<ProfileSection />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
