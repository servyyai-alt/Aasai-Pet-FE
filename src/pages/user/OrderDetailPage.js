import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cancelOrder, fetchOrder } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const statusIcons = { Pending: FiClock, Processing: FiPackage, Shipped: FiTruck, Delivered: FiCheckCircle, Cancelled: FiXCircle };
const statusColors = { Pending: 'bg-amber-100 text-amber-700', Processing: 'bg-blue-100 text-blue-700', Shipped: 'bg-ocean-100 text-ocean-700', Delivered: 'bg-green-100 text-green-700', Cancelled: 'bg-red-100 text-red-700' };

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder(id).then(r => { setOrder(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-20 text-ocean-400">Order not found</div>;

  const StatusIcon = statusIcons[order.orderStatus] || FiClock;
  const currentStep = statusSteps.indexOf(order.orderStatus);
  const canCancel = Boolean(order.isPaid) && !['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/dashboard/orders" className="flex items-center gap-2 text-ocean-500 hover:text-ocean-700 mb-6"><FiArrowLeft /> My Orders</Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Order Details</h1>
          <p className="text-ocean-400 font-mono text-sm mt-1">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`badge px-3 py-1.5 text-sm font-medium rounded-xl ${statusColors[order.orderStatus]}`}>
          <StatusIcon className="inline w-4 h-4 mr-1" /> {order.orderStatus}
        </span>
      </div>

      {/* Progress Bar */}
      {order.orderStatus !== 'Cancelled' && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-ocean-100 z-0" />
            <div className="absolute top-4 left-0 h-0.5 bg-ocean-500 z-0 transition-all duration-500"
              style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }} />
            {statusSteps.map((s, i) => {
              const Icon = statusIcons[s];
              return (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${i <= currentStep ? 'bg-ocean-600 text-white' : 'bg-ocean-100 text-ocean-300'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-medium ${i <= currentStep ? 'text-ocean-700' : 'text-ocean-300'}`}>{s}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Shipping */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-ocean-900 mb-3">Shipping Address</h3>
          <div className="text-ocean-600 text-sm space-y-1">
            <p className="font-medium text-ocean-800">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </div>
        </div>
        {/* Payment */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-ocean-900 mb-3">Payment Info</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between text-ocean-600"><span>Method</span><span className="font-medium capitalize">{order.paymentMethod}</span></div>
            <div className="flex justify-between text-ocean-600"><span>Status</span>
              <span className={`font-medium ${order.isPaid ? 'text-green-500' : 'text-amber-500'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span>
            </div>
            {order.isPaid && <div className="flex justify-between text-ocean-600"><span>Paid At</span><span>{new Date(order.paidAt).toLocaleDateString('en-IN')}</span></div>}
            <div className="flex justify-between font-bold text-ocean-900 text-base border-t pt-2"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      {order.orderStatus === 'Cancelled' && order.cancelReason && (
        <div className="card p-5 mb-6 border border-red-200 bg-red-50">
          <h3 className="font-display font-bold text-red-700 mb-2">Order Cancelled</h3>
          <p className="text-sm text-red-700">Reason: {order.cancelReason}</p>
        </div>
      )}

      {canCancel && (
        <div className="card p-5 mb-6">
          <h3 className="font-display font-bold text-ocean-900 mb-2">Cancel Order</h3>
          <p className="text-sm text-ocean-500 mb-3">You can cancel only before it is shipped.</p>
          <textarea
            rows={3}
            className="input-field resize-none"
            placeholder="Reason for cancellation (required)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <button
            disabled={cancelling}
            onClick={async () => {
              const reason = cancelReason.trim();
              if (!reason) { toast.error('Please enter a cancel reason'); return; }
              setCancelling(true);
              try {
                const { data } = await cancelOrder(order._id, { cancelReason: reason });
                setOrder(data);
                toast.success('Order cancelled');
              } catch (e) {
                toast.error(e.message);
              } finally {
                setCancelling(false);
              }
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}

      {/* Items */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-ocean-900 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex gap-3 items-center p-3 bg-ocean-50 rounded-xl">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0">
                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center bg-ocean-gradient"><GiTropicalFish className="w-6 h-6 text-white/50" /></div>}
              </div>
              <div className="flex-1"><p className="font-medium text-ocean-800 text-sm">{item.name}</p><p className="text-ocean-400 text-xs">Qty: {item.quantity}</p></div>
              <p className="font-bold text-ocean-800">₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-ocean-100 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-ocean-600"><span>Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
          <div className="flex justify-between text-ocean-600"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
          <div className="flex justify-between text-ocean-600"><span>Tax</span><span>₹{order.taxPrice?.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-ocean-900 text-base"><span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
