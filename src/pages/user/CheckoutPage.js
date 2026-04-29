import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder, createRazorpayOrder, verifyPayment, payOrder } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiCreditCard, FiMapPin, FiChevronRight } from 'react-icons/fi';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    street: user?.address?.street || '', city: user?.address?.city || '',
    state: user?.address?.state || '', pincode: user?.address?.pincode || '',
    country: 'India',
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const totalPrice = cartTotal + shipping + tax;

  const handleAddressChange = (e) => setAddress(a => ({ ...a, [e.target.name]: e.target.value }));

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create backend order
      const orderData = {
        orderItems: cartItems.map(i => ({ product: i._id, name: i.name, image: i.images?.[0]?.url, price: i.discountPrice || i.price, quantity: i.quantity })),
        shippingAddress: address, paymentMethod: 'razorpay',
        itemsPrice: cartTotal, taxPrice: tax, shippingPrice: shipping, totalPrice,
      };
      const { data: order } = await createOrder(orderData);

      // Create Razorpay order
      const { data: rzpOrder } = await createRazorpayOrder(totalPrice);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
        amount: rzpOrder.amount,
        currency: 'INR',
        name: 'AquaMart',
        description: 'Aquatic Products Purchase',
        order_id: rzpOrder.orderId,
        handler: async (response) => {
          try {
            // Verify payment
            const { data: verification } = await verifyPayment(response);
            if (verification.verified) {
              // Update order as paid
              await payOrder(order._id, { ...response, status: 'COMPLETED' });
              clearCart();
              toast.success('Payment successful! 🎉');
              navigate(`/order-success/${order._id}`);
            }
          } catch (e) { toast.error('Payment verification failed'); }
        },
        prefill: { name: address.name, email: user.email, contact: address.phone },
        theme: { color: '#0369a1' },
        modal: { ondismiss: () => setLoading(false) },
      };

      if (!window.Razorpay) {
        toast.error('Razorpay not loaded. Please refresh.');
        setLoading(false);
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };

  const addressFields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 98765 43210' },
    { name: 'street', label: 'Street Address', type: 'text', placeholder: '123 MG Road, Apartment 4B' },
    { name: 'city', label: 'City', type: 'text', placeholder: 'Chennai' },
    { name: 'state', label: 'State', type: 'text', placeholder: 'Tamil Nadu' },
    { name: 'pincode', label: 'Pincode', type: 'text', placeholder: '600001' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${step >= s ? 'bg-ocean-600 text-white' : 'bg-ocean-100 text-ocean-400'}`}>
              {s === 1 ? <><FiMapPin className="w-4 h-4" /> Address</> : <><FiCreditCard className="w-4 h-4" /> Payment</>}
            </div>
            {i === 0 && <FiChevronRight className="text-ocean-300" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 ? (
            <div className="card p-6">
              <h2 className="font-display font-bold text-xl text-ocean-900 mb-5">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                {addressFields.map(f => (
                  <div key={f.name} className={f.name === 'street' ? 'col-span-2' : ''}>
                    <label className="block text-sm font-medium text-ocean-700 mb-1">{f.label}</label>
                    <input type={f.type} name={f.name} placeholder={f.placeholder} value={address[f.name]} onChange={handleAddressChange}
                      required className="input-field" />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary mt-6 flex items-center gap-2">
                Continue to Payment <FiChevronRight />
              </button>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="font-display font-bold text-xl text-ocean-900 mb-5">Review & Pay</h2>
              <div className="bg-ocean-50 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-ocean-800 mb-2 flex items-center gap-2"><FiMapPin className="w-4 h-4 text-ocean-500" /> Delivering to:</h3>
                <p className="text-ocean-600 text-sm">{address.name} • {address.phone}</p>
                <p className="text-ocean-600 text-sm">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
              </div>
              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item._id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-ocean-50 flex-shrink-0">
                      {item.images?.[0] ? <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-ocean-gradient" />}
                    </div>
                    <div className="flex-1"><p className="font-medium text-ocean-800 text-sm line-clamp-1">{item.name}</p><p className="text-ocean-400 text-xs">Qty: {item.quantity}</p></div>
                    <p className="font-bold text-ocean-800 text-sm">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={handlePayment} disabled={loading} className="btn-primary flex-2 flex items-center justify-center gap-2 flex-1">
                  {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiCreditCard /> Pay ₹{totalPrice.toLocaleString()}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="card p-5 h-fit">
          <h3 className="font-display font-bold text-ocean-900 mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-ocean-600"><span>Subtotal ({cartItems.length} items)</span><span>₹{cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-ocean-600"><span>Shipping</span><span className={shipping === 0 ? 'text-green-500' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="flex justify-between text-ocean-600"><span>Tax (GST)</span><span>₹{tax.toLocaleString()}</span></div>
            <div className="border-t pt-2 flex justify-between font-bold text-ocean-900"><span>Total</span><span>₹{totalPrice.toLocaleString()}</span></div>
          </div>
          <div className="bg-aqua-50 rounded-xl p-3 flex items-center gap-2 text-xs text-aqua-700">
            <FiCreditCard className="w-4 h-4" /> Secured by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
