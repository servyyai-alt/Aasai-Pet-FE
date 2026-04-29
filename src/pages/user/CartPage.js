import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  if (cartItems.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-ocean-400">
      <GiTropicalFish className="w-24 h-24 mb-6 animate-float" />
      <h2 className="font-display text-2xl font-bold text-ocean-700 mb-2">Your cart is empty</h2>
      <p className="mb-6">Dive in and find something amazing!</p>
      <Link to="/products" className="btn-primary">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/products" className="text-ocean-500 hover:text-ocean-700"><FiArrowLeft /></Link>
        <h1 className="section-title">Shopping Cart</h1>
        <span className="badge bg-ocean-100 text-ocean-600">{cartItems.length} items</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item._id} className="card p-4 flex gap-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-ocean-50">
                {item.images?.[0] ? (
                  <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-ocean-gradient">
                    <GiTropicalFish className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item._id}`} className="font-display font-semibold text-ocean-900 hover:text-ocean-600 line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-ocean-400 text-sm">{item.category?.name}</p>
                <p className="font-bold text-ocean-800 mt-1">₹{(item.discountPrice || item.price).toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 p-1"><FiTrash2 /></button>
                <div className="flex items-center border border-ocean-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 hover:bg-ocean-50"><FiMinus className="w-3 h-3" /></button>
                  <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="px-2 py-1 hover:bg-ocean-50 disabled:opacity-40"><FiPlus className="w-3 h-3" /></button>
                </div>
                <p className="font-bold text-ocean-800 text-sm">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-bold text-xl text-ocean-900 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-ocean-600"><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-ocean-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-500 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              {shipping > 0 && <p className="text-xs text-ocean-400">Add ₹{(999 - cartTotal).toFixed(0)} more for free shipping</p>}
              <div className="flex justify-between text-ocean-600"><span>Tax (GST 18%)</span><span>₹{tax.toLocaleString()}</span></div>
              <div className="border-t border-ocean-100 pt-3 flex justify-between font-bold text-ocean-900 text-base">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => { if (!user) navigate('/login', { state: { from: { pathname: '/checkout' } } }); else navigate('/checkout'); }}
              className="btn-primary w-full flex items-center justify-center gap-2">
              <FiShoppingBag /> Proceed to Checkout
            </button>
            <Link to="/products" className="btn-secondary w-full flex items-center justify-center mt-3 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
