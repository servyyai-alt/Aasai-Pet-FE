import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchAllProductsAdmin, deleteProduct } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiAlertTriangle } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    fetchAllProductsAdmin().then(r => { setProducts(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      setProducts(p => p.filter(prod => prod._id !== id));
    } catch (e) { toast.error(e.message); }
    finally { setDeletingId(null); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout title="Products">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pl-10 text-white placeholder-white/30 focus:outline-none focus:border-aqua-400 text-sm" />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
          </div>
          <Link to="/admin/products/new" className="flex items-center gap-2 bg-aqua-500 hover:bg-aqua-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
            <FiPlus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-white/40 font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-white/10 rounded animate-pulse" /></td>)}
                  </tr>
                )) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-white/30">
                    <GiTropicalFish className="w-10 h-10 mx-auto mb-2 animate-float" />
                    No products found
                  </td></tr>
                ) : filtered.map(product => (
                  <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
                          {product.images?.[0] ? <img src={product.images[0].url} alt="" className="w-full h-full object-cover" /> :
                            <div className="w-full h-full flex items-center justify-center"><GiTropicalFish className="w-5 h-5 text-white/30" /></div>}
                        </div>
                        <div>
                          <p className="font-medium text-white truncate max-w-[180px]">{product.name}</p>
                          {product.isFeatured && <span className="text-xs text-aqua-400">⭐ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{product.category?.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">₹{(product.discountPrice || product.price).toLocaleString()}</span>
                      {product.discountPrice && <span className="text-white/30 line-through text-xs ml-1">₹{product.price.toLocaleString()}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.stock < 10 ? 'text-amber-400' : product.stock === 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {product.stock}
                        {product.stock < 10 && product.stock > 0 && <FiAlertTriangle className="inline w-3 h-3 ml-1" />}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${product.isActive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link to={`/admin/products/edit/${product._id}`} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                          <FiEdit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleDelete(product._id, product.name)} disabled={deletingId === product._id}
                          className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 disabled:opacity-50">
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-white/30 text-xs mt-3">{filtered.length} products total</p>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
