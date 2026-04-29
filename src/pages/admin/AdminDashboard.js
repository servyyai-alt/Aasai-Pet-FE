import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchOverview, fetchRecentActivity } from '../../utils/api';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiBox, FiDollarSign, FiAlertTriangle, FiClock, FiArrowRight } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <div className={`${color} bg-white/10 p-2.5 rounded-xl`}><Icon className="w-5 h-5" /></div>
    </div>
    <p className="font-display text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-white/50 text-sm">{label}</p>
    {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
  </div>
);

const statusColors = { Pending: 'text-amber-400 bg-amber-400/20', Processing: 'text-blue-400 bg-blue-400/20', Shipped: 'text-ocean-400 bg-ocean-400/20', Delivered: 'text-green-400 bg-green-400/20', Cancelled: 'text-red-400 bg-red-400/20' };

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOverview(), fetchRecentActivity()])
      .then(([ov, ac]) => { setOverview(ov.data); setActivity(ac.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = overview ? [
    { icon: FiDollarSign, label: 'Total Revenue', value: `₹${overview.totalRevenue?.toLocaleString()}`, color: 'text-green-400', sub: 'From paid orders' },
    { icon: FiShoppingBag, label: 'Total Orders', value: overview.totalOrders, color: 'text-blue-400', sub: `${overview.pendingOrders} pending` },
    { icon: FiUsers, label: 'Customers', value: overview.totalUsers, color: 'text-aqua-400', sub: 'Registered users' },
    { icon: FiBox, label: 'Products', value: overview.totalProducts, color: 'text-purple-400', sub: `${overview.lowStockProducts} low stock` },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      <div className="animate-fade-in">
        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl h-32 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        )}

        {/* Alerts */}
        {overview?.lowStockProducts > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <FiAlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm flex-1">{overview.lowStockProducts} products are low on stock (less than 10 units)</p>
            <Link to="/admin/products" className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1">
              View <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white">Recent Orders</h3>
              <Link to="/admin/orders" className="text-aqua-400 hover:text-aqua-300 text-sm flex items-center gap-1">
                View all <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {activity?.recentOrders?.length > 0 ? (
              <div className="space-y-3">
                {activity.recentOrders.slice(0, 5).map(order => (
                  <Link key={order._id} to={`/admin/orders`} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiShoppingBag className="w-4 h-4 text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{order.user?.name || 'Guest'}</p>
                      <p className="text-white/40 text-xs">#{order._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-bold">₹{order.totalPrice?.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.orderStatus]}`}>{order.orderStatus}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : <p className="text-white/30 text-sm">No orders yet</p>}
          </div>

          {/* New Users */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white">New Customers</h3>
              <Link to="/admin/users" className="text-aqua-400 hover:text-aqua-300 text-sm flex items-center gap-1">
                View all <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {activity?.newUsers?.length > 0 ? (
              <div className="space-y-3">
                {activity.newUsers.map(u => (
                  <div key={u._id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <div className="w-9 h-9 bg-aqua-500/30 text-aqua-300 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {u.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{u.name}</p>
                      <p className="text-white/40 text-xs truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <FiClock className="w-3 h-3" />
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-white/30 text-sm">No users yet</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
