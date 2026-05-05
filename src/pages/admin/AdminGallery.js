import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { createGalleryItem, deleteGalleryItem, fetchAllProductsAdmin, fetchGalleryItems, updateGalleryItem } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload } from 'react-icons/fi';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    productId: '',
    mediaUrl: '',
    mediaType: '',
  });

  const load = () => {
    setLoading(true);
    fetchGalleryItems()
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    fetchAllProductsAdmin().then((r) => setProducts(r.data || [])).catch(() => setProducts([]));
  }, []);

  const productOptions = useMemo(() => products.slice(0, 250), [products]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', description: '', productId: '', mediaUrl: '', mediaType: '' });
    setMediaFile(null);
    setMediaPreview('');
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      productId: item.productId || '',
      mediaUrl: item.mediaUrl || '',
      mediaType: item.mediaType || '',
    });
    setMediaFile(null);
    setMediaPreview(item.mediaUrl || '');
    setShowForm(true);
  };

  const onMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    const isVideo = file.type?.startsWith('video/');
    setForm((f) => ({ ...f, mediaType: isVideo ? 'video' : 'image' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description || '');
      if (form.productId) fd.append('productId', form.productId);
      if (form.mediaType) fd.append('mediaType', form.mediaType);
      if (mediaFile) fd.append('media', mediaFile);
      else if (form.mediaUrl) fd.append('mediaUrl', form.mediaUrl);

      if (editingId) {
        await updateGalleryItem(editingId, fd);
        toast.success('Gallery item updated!');
      } else {
        await createGalleryItem(fd);
        toast.success('Gallery item created!');
      }
      resetForm();
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete gallery item "${title}"?`)) return;
    try {
      await deleteGalleryItem(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success('Gallery item deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const inputClass =
    'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-aqua-400 text-sm';

  return (
    <AdminLayout title="Gallery">
      <div className="animate-fade-in max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/40 text-sm">{items.length} items</p>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) resetForm();
            }}
            className="flex items-center gap-2 bg-aqua-500 hover:bg-aqua-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors"
          >
            {showForm ? (
              <>
                <FiX /> Cancel
              </>
            ) : (
              <>
                <FiPlus /> Add Gallery Item
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 animate-slide-up">
            <h3 className="font-display font-bold text-white mb-4">{editingId ? 'Edit Gallery Item' : 'New Gallery Item'}</h3>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Title *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Premium Aquarium Showcase"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="Optional description for the gallery item"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Linked Product (optional)</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={form.productId}
                  onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                >
                  <option value="">None</option>
                  {productOptions.map((p) => (
                    <option key={p._id} value={p._id} className="bg-ocean-900">
                      {p.name}
                    </option>
                  ))}
                </select>
                {products.length > productOptions.length && (
                  <p className="text-white/35 text-xs mt-1">Showing first {productOptions.length} products.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Media Type</label>
                <select
                  className={`${inputClass} appearance-none`}
                  value={form.mediaType}
                  onChange={(e) => setForm((f) => ({ ...f, mediaType: e.target.value }))}
                >
                  <option value="">Auto</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Upload Media</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-xl p-5 cursor-pointer hover:border-aqua-400 transition-colors">
                  <FiUpload className="w-5 h-5 text-white/40" />
                  <span className="text-white/40 text-sm">Click to upload (image/video)</span>
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={onMediaChange} />
                </label>
                <p className="text-white/30 text-xs mt-2">Or paste a URL below (optional).</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Media URL (optional)</label>
                <input
                  className={inputClass}
                  placeholder="https://..."
                  value={form.mediaUrl}
                  onChange={(e) => setForm((f) => ({ ...f, mediaUrl: e.target.value }))}
                />
              </div>

              {mediaPreview && (
                <div className="md:col-span-2">
                  <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <div className="aspect-[4/3]">
                      {(form.mediaType || '').toLowerCase() === 'video' ? (
                        <video className="w-full h-full object-cover" src={mediaPreview} controls playsInline />
                      ) : (
                        <img className="w-full h-full object-cover" src={mediaPreview} alt="" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-aqua-500 hover:bg-aqua-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiCheck /> {editingId ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            [...Array(5)].map((_, i) => <div key={i} className="bg-white/5 rounded-xl h-20 animate-pulse" />)
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-white/30">No gallery items yet</div>
          ) : (
            items.map((it) => (
              <div
                key={it._id}
                className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 transition-colors group"
              >
                <div className="w-16 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 ring-1 ring-white/10">
                  {it.mediaType === 'video' ? (
                    <video className="w-full h-full object-cover" src={it.mediaUrl} muted playsInline />
                  ) : (
                    <img className="w-full h-full object-cover" src={it.mediaUrl} alt="" loading="lazy" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{it.title}</p>
                  {it.description ? <p className="text-white/40 text-sm truncate">{it.description}</p> : <p className="text-white/25 text-sm">—</p>}
                  <p className="text-white/30 text-xs font-mono">{it.mediaType}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(it)}
                    className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                    title="Edit"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(it._id, it.title)}
                    className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    title="Delete"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;

