import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchCategories, fetchProduct, createProduct, updateProduct } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiX, FiUpload } from 'react-icons/fi';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [tag, setTag] = useState('');

  const [form, setForm] = useState({
    name: '', description: '', price: '', discountPrice: '', category: '',
    stock: '', brand: '', isFeatured: false, isActive: true,
    tags: [], specifications: [],
  });

  useEffect(() => {
    fetchCategories().then(r => setCategories(r.data)).catch(console.error);
    if (isEdit) {
      fetchProduct(id).then(r => {
        const p = r.data;
        setForm({ name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice || '', category: p.category?._id || '', stock: p.stock, brand: p.brand || '', isFeatured: p.isFeatured, isActive: p.isActive, tags: p.tags || [], specifications: p.specifications || [] });
        setImagePreviews(p.images?.map(i => ({ url: i.url, existing: true, id: i._id })) || []);
      }).catch(console.error);
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    const previews = files.map(f => ({ url: URL.createObjectURL(f), existing: false }));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (idx) => {
    const preview = imagePreviews[idx];
    if (!preview.existing) {
      setImageFiles(prev => {
        const newFiles = [...prev];
        const fileIdx = imagePreviews.slice(0, idx).filter(p => !p.existing).length;
        newFiles.splice(fileIdx, 1);
        return newFiles;
      });
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const addSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setForm(f => ({ ...f, specifications: [...f.specifications, { key: specKey.trim(), value: specValue.trim() }] }));
      setSpecKey(''); setSpecValue('');
    }
  };

  const addTag = () => {
    if (tag.trim() && !form.tags.includes(tag.trim())) {
      setForm(f => ({ ...f, tags: [...f.tags, tag.trim()] }));
      setTag('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags' || k === 'specifications') formData.append(k, JSON.stringify(v));
        else formData.append(k, v);
      });
      imageFiles.forEach(f => formData.append('images', f));

      if (isEdit) {
        await updateProduct(id, formData);
        toast.success('Product updated!');
      } else {
        await createProduct(formData);
        toast.success('Product created!');
      }
      navigate('/admin/products');
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-aqua-400 transition-colors text-sm";

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add Product'}>
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors text-sm">
        <FiArrowLeft /> Back to Products
      </button>

      <form onSubmit={handleSubmit} className="max-w-4xl animate-fade-in">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display font-bold text-white mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Product Name *</label>
                  <input className={inputClass} placeholder="e.g. Neon Tetra Fish" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Description *</label>
                  <textarea className={`${inputClass} resize-none`} rows={4} placeholder="Describe the product..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Price (₹) *</label>
                    <input type="number" className={inputClass} placeholder="0.00" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Discount Price (₹)</label>
                    <input type="number" className={inputClass} placeholder="Optional" min="0" value={form.discountPrice} onChange={e => setForm(f => ({ ...f, discountPrice: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Stock *</label>
                    <input type="number" className={inputClass} placeholder="0" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Brand</label>
                    <input className={inputClass} placeholder="Brand name" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display font-bold text-white mb-4">Specifications</h3>
              <div className="flex gap-2 mb-3">
                <input className={inputClass} placeholder="Key (e.g. Size)" value={specKey} onChange={e => setSpecKey(e.target.value)} />
                <input className={inputClass} placeholder="Value (e.g. 2 inches)" value={specValue} onChange={e => setSpecValue(e.target.value)} />
                <button type="button" onClick={addSpec} className="bg-aqua-500 hover:bg-aqua-600 text-white p-3 rounded-xl flex-shrink-0"><FiPlus /></button>
              </div>
              {form.specifications.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.specifications.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 bg-white/10 text-white/70 px-3 py-1 rounded-lg text-sm">
                      <span className="text-white/40">{s.key}:</span> {s.value}
                      <button type="button" onClick={() => setForm(f => ({ ...f, specifications: f.specifications.filter((_, j) => j !== i) }))} className="text-white/30 hover:text-red-400 ml-1">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display font-bold text-white mb-4">Tags</h3>
              <div className="flex gap-2 mb-3">
                <input className={inputClass} placeholder="Add a tag" value={tag} onChange={e => setTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <button type="button" onClick={addTag} className="bg-aqua-500 hover:bg-aqua-600 text-white p-3 rounded-xl flex-shrink-0"><FiPlus /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.tags.map((t, i) => (
                  <span key={i} className="flex items-center gap-1 bg-aqua-500/20 text-aqua-300 px-3 py-1 rounded-full text-sm">
                    {t}
                    <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter((_, j) => j !== i) }))} className="hover:text-red-400"><FiX className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Images */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-display font-bold text-white mb-4">Images</h3>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-6 cursor-pointer hover:border-aqua-400 transition-colors">
                <FiUpload className="w-8 h-8 text-white/30 mb-2" />
                <p className="text-white/40 text-sm text-center">Click to upload images<br /><span className="text-xs">JPG, PNG, WebP (max 5)</span></p>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {imagePreviews.map((img, i) => (
                    <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-white/10">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category & Settings */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h3 className="font-display font-bold text-white mb-2">Settings</h3>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Category *</label>
                <select className={`${inputClass} appearance-none`} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c._id} value={c._id} className="bg-ocean-900">{c.name}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${form.isFeatured ? 'bg-aqua-500' : 'bg-white/20'}`} onClick={() => setForm(f => ({ ...f, isFeatured: !f.isFeatured }))}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isFeatured ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-white/70 text-sm">Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${form.isActive ? 'bg-aqua-500' : 'bg-white/20'}`} onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isActive ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-white/70 text-sm">Active (Visible)</span>
              </label>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-aqua-500 hover:bg-aqua-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProductForm;
