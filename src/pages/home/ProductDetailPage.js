import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { fetchProduct } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiStar, FiMinus, FiPlus, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct(id).then(r => { setProduct(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleAddReview = async () => {
    if (!review.comment.trim()) return toast.error('Please write a comment');
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const { data } = await fetchProduct(id);
      setProduct(data);
      setReview({ rating: 5, comment: '' });
    } catch (e) { toast.error(e.message); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-ocean-400">Product not found</div>;

  const price = product.discountPrice || product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/products" className="flex items-center gap-2 text-ocean-500 hover:text-ocean-700 mb-6 transition-colors">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        {/* Images */}
        <div>
          <div className="bg-ocean-50 rounded-2xl overflow-hidden h-96 mb-3">
            {product.images && product.images[selectedImg] ? (
              <img src={product.images[selectedImg].url} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-ocean-gradient">
                <GiTropicalFish className="w-32 h-32 text-white/50 animate-float" />
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-ocean-500' : 'border-ocean-100'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-aqua-500 font-medium text-sm uppercase tracking-wide mb-1">{product.category?.name}</p>
          <h1 className="font-display text-3xl font-bold text-ocean-900 mb-3">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex">{[1,2,3,4,5].map(s => <FiStar key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}</div>
            <span className="text-ocean-400 text-sm">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-bold text-ocean-800">₹{price.toLocaleString()}</span>
            {product.discountPrice && <span className="text-xl text-ocean-300 line-through">₹{product.price.toLocaleString()}</span>}
            {product.discountPrice && <span className="badge bg-coral-500 text-white">{Math.round((1-product.discountPrice/product.price)*100)}% OFF</span>}
          </div>

          <p className="text-ocean-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <><FiCheck className="w-4 h-4 text-green-500" /><span className="text-green-600 font-medium">In Stock ({product.stock} available)</span></>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border-2 border-ocean-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-2 hover:bg-ocean-50"><FiMinus /></button>
                <span className="px-4 py-2 font-medium text-ocean-800">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-3 py-2 hover:bg-ocean-50"><FiPlus /></button>
              </div>
              <button onClick={() => addToCart(product, qty)} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}

          {/* Specs */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="border-t border-ocean-100 pt-5">
              <h3 className="font-display font-bold text-ocean-800 mb-3">Specifications</h3>
              <dl className="grid grid-cols-2 gap-2">
                {product.specifications.map((s, i) => (
                  <div key={i} className="bg-ocean-50 rounded-xl p-3">
                    <dt className="text-xs text-ocean-400 mb-1">{s.key}</dt>
                    <dd className="font-medium text-ocean-800 text-sm">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="card p-6">
        <h2 className="font-display text-2xl font-bold text-ocean-900 mb-6">Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {product.reviews.map((r, i) => (
              <div key={i} className="bg-ocean-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-ocean-800">{r.name}</span>
                  <div className="flex">{[1,2,3,4,5].map(s => <FiStar key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}</div>
                </div>
                <p className="text-ocean-600 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-ocean-400 mb-6">No reviews yet. Be the first!</p>}

        {user && (
          <div className="border-t border-ocean-100 pt-6">
            <h3 className="font-display font-bold text-ocean-800 mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setReview(r => ({ ...r, rating: s }))}>
                  <FiStar className={`w-6 h-6 transition-colors ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 hover:text-amber-300'}`} />
                </button>
              ))}
            </div>
            <textarea value={review.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
              placeholder="Share your experience..." rows={3} className="input-field mb-3 resize-none" />
            <button onClick={handleAddReview} disabled={submittingReview} className="btn-primary text-sm">
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
