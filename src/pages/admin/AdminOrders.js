import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAllOrders, updateOrderStatus } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

const statusColors = {
  Pending: 'bg-amber-400/20 text-amber-400',
  Processing: 'bg-blue-400/20 text-blue-400',
  Shipped: 'bg-ocean-400/20 text-ocean-400',
  Delivered: 'bg-green-400/20 text-green-400',
  Cancelled: 'bg-red-400/20 text-red-400',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const load = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    fetchAllOrders(params).then(r => { setOrders(r.data.orders); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success('Order status updated!');
    } catch (e) { toast.error(e.message); }
    finally { setUpdating(null); }
  };

  const statuses = ['', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const filtered = orders.filter(o =>
    !search || o._id.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Orders">
      <div className="animate-fade-in">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <input type="text" placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-white/30 focus:outline-none focus:border-aqua-400 text-sm" />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pr-8 text-white text-sm focus:outline-none focus:border-aqua-400 appearance-none">
              {statuses.map(s => <option key={s} value={s} className="bg-ocean-900">{s || 'All Statuses'}</option>)}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {['Pending', 'Processing', 'Shipped', 'Delivered'].map(s => {
            const count = orders.filter(o => o.orderStatus === s).length;
            return count > 0 ? (
              <button key={s} onClick={() => setStatusFilter(s === statusFilter ? '' : s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${statusColors[s]} ${statusFilter === s ? 'ring-2 ring-current ring-offset-1 ring-offset-transparent' : 'border-current/30'}`}>
                {s}: {count}
              </button>
            ) : null;
          })}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-white/10 rounded animate-pulse" /></td>)}
                  </tr>
                )) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-white/30">No orders found</td></tr>
                ) : filtered.map(order => (
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-mono text-white/60 text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-sm">{order.user?.name || 'N/A'}</p>
                      <p className="text-white/40 text-xs">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-white/60">{order.orderItems?.length}</td>
                    <td className="px-4 py-3 font-bold text-white">₹{order.totalPrice?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${order.isPaid ? 'bg-green-400/20 text-green-400' : 'bg-amber-400/20 text-amber-400'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusColors[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select value={order.orderStatus} onChange={e => handleStatusChange(order._id, e.target.value)}
                          disabled={updating === order._id || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                          className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-aqua-400 disabled:opacity-40 appearance-none pr-5">
                          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                            <option key={s} value={s} className="bg-ocean-900">{s}</option>
                          ))}
                        </select>
                        <FiChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-white/40 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-white/30 text-xs mt-3">{filtered.length} orders total</p>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
