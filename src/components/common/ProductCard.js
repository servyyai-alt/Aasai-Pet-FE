import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discount = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

  return (
    <div className="card group relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.isFeatured && <span className="badge bg-aqua-500 text-white">⭐ Featured</span>}
        {hasDiscount && <span className="badge bg-coral-500 text-white">{discount}% OFF</span>}
        {product.stock < 5 && product.stock > 0 && <span className="badge bg-amber-400 text-white">Low Stock</span>}
        {product.stock === 0 && <span className="badge bg-red-500 text-white">Out of Stock</span>}
      </div>

      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden h-48">
        {product.images && product.images[0] ? (
          <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-coral-500 to-coral-400 flex items-center justify-center">
            <GiTropicalFish className="w-16 h-16 text-white/60 animate-float" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 bg-white text-[#E07B39] px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <FiEye className="w-4 h-4" /> View Details
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-[#E07B39] font-medium mb-1 uppercase tracking-wide">
          {product.category?.name || 'Aquatic'}
        </p>
        <Link to={`/products/${product._id}`}>
          <h3 className="font-display font-semibold text-orange-950 mb-2 hover:text-coral-600 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <FiStar key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
          </div>
          <span className="text-xs text-orange-400">({product.numReviews})</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-lg text-orange-950">₹{price.toLocaleString()}</span>
            {hasDiscount && <span className="text-sm text-orange-300 line-through ml-1">₹{product.price.toLocaleString()}</span>}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="bg-coral-600 hover:bg-coral-500 disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <FiShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
