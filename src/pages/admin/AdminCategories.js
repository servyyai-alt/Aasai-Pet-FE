import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchCategoriesAdmin, createCategory, updateCategory, deleteCategory } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    fetchCategoriesAdmin().then(r => { setCategories(r.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      if (editingId) {
        await updateCategory(editingId, formData);
        toast.success('Category updated!');
      } else {
        await createCategory(formData);
        toast.success('Category created!');
      }
      setShowForm(false); setEditingId(null); setForm({ name: '', description: '' });
      load();
    } catch (e) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch (e) { toast.error(e.message); }
  };

  return (
    <AdminLayout title="Categories">
      <div className="animate-fade-in max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">{categories.length} categories</p>
          <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ name: '', description: '' }); }}
            className="flex items-center gap-2 bg-aqua-500 hover:bg-aqua-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
            {showForm ? <><FiX /> Cancel</> : <><FiPlus /> Add Category</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 animate-slide-up">
            <h3 className="font-display font-bold text-white mb-4">{editingId ? 'Edit Category' : 'New Category'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Name *</label>
                <input className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-aqua-400 text-sm"
                  placeholder="e.g. Live Fish" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Description</label>
                <input className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-aqua-400 text-sm"
                  placeholder="Short description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="flex items-center gap-2 bg-aqua-500 hover:bg-aqua-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors">
                  {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiCheck /> {editingId ? 'Update' : 'Create'}</>}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {loading ? [...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-16 animate-pulse" />) :
            categories.length === 0 ? (
              <div className="text-center py-12 text-white/30">
                <GiTropicalFish className="w-10 h-10 mx-auto mb-2 animate-float" />
                No categories yet
              </div>
            ) : categories.map(cat => (
              <div key={cat._id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors group">
                <div className="w-10 h-10 bg-aqua-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <GiTropicalFish className="w-5 h-5 text-aqua-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{cat.name}</p>
                  {cat.description && <p className="text-white/40 text-sm truncate">{cat.description}</p>}
                  <p className="text-white/30 text-xs font-mono">/{cat.slug}</p>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs ${cat.isActive ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}`}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(cat)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"><FiEdit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><FiTrash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
