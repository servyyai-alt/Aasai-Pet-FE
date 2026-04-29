import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchOverview, fetchSalesData, fetchTopProducts, fetchOrdersByStatus, fetchCategorySales } from '../../utils/api';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiTrendingUp, FiDollarSign, FiShoppingBag, FiUsers } from 'react-icons/fi';

const COLORS = ['#22d3ee', '#0ea5e9', '#0369a1', '#06b6d4', '#38bdf8', '#7dd3fc'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ocean-900 border border-white/10 rounded-xl p-3 shadow-xl">
        <p className="text-white/60 text-xs mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-bold text-sm" style={{ color: p.color }}>
            {p.name}: {p.name === 'revenue' ? `₹${p.value?.toLocaleString()}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAnalytics = () => {
  const [overview, setOverview] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchOverview(), fetchSalesData(days), fetchTopProducts(), fetchOrdersByStatus(), fetchCategorySales()])
      .then(([ov, sd, tp, os, cs]) => {
        setOverview(ov.data);
        setSalesData(sd.data.map(d => ({ ...d, date: d._id, revenue: Math.round(d.revenue) })));
        setTopProducts(tp.data);
        setOrdersByStatus(os.data.map(d => ({ name: d._id, value: d.count })));
        setCategorySales(cs.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const statCards = overview ? [
    { icon: FiDollarSign, label: 'Total Revenue', value: `₹${overview.totalRevenue?.toLocaleString()}`, color: '#22d3ee' },
    { icon: FiShoppingBag, label: 'Total Orders', value: overview.totalOrders, color: '#38bdf8' },
    { icon: FiUsers, label: 'Total Customers', value: overview.totalUsers, color: '#7dd3fc' },
    { icon: FiTrendingUp, label: 'Pending Orders', value: overview.pendingOrders, color: '#fb923c' },
  ] : [];

  return (
    <AdminLayout title="Analytics">
      <div className="animate-fade-in space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? [...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl h-24 animate-pulse" />) :
            statCards.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <Icon className="w-5 h-5 mb-2" style={{ color }} />
                <p className="font-display text-2xl font-bold text-white">{value}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
              </div>
            ))}
        </div>

        {/* Sales Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-white">Revenue & Orders</h3>
            <div className="flex gap-2">
              {[7, 30, 90].map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${days === d ? 'bg-aqua-500 text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}>
                  {d}d
                </button>
              ))}
            </div>
          </div>
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={2} fill="url(#revGradient)" name="revenue" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-white/30 text-sm">No sales data for this period</div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Orders by Status */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-display font-bold text-white mb-5">Orders by Status</h3>
            {ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} contentStyle={{ background: '#0c4a6e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span className="text-white/60 text-xs">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-white/30 text-sm">No order data</div>}
          </div>

          {/* Category Sales */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="font-display font-bold text-white mb-5">Revenue by Category</h3>
            {categorySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categorySales} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} tickLine={false} tickFormatter={v => `₹${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                  <YAxis type="category" dataKey="_id" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} width={80} />
                  <Tooltip contentStyle={{ background: '#0c4a6e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} formatter={v => [`₹${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#22d3ee" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="h-48 flex items-center justify-center text-white/30 text-sm">No category data</div>}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="font-display font-bold text-white mb-5">Top Selling Products</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.slice(0, 8).map((p, i) => {
                const maxSold = topProducts[0]?.sold || 1;
                return (
                  <div key={p._id} className="flex items-center gap-4">
                    <span className="text-white/20 font-mono text-sm w-5 text-right">{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                      {p.images?.[0] ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-ocean-gradient" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.name}</p>
                      <div className="mt-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-aqua-400 rounded-full transition-all" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-sm font-bold">{p.sold} sold</p>
                      <p className="text-white/40 text-xs">₹{(p.discountPrice || p.price).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-white/30 text-sm">No product data available</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
