import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrder } from '../../utils/api';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder(id).then(r => setOrder(r.data)).catch(console.error);
  }, [id]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-ocean-100">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <GiTropicalFish className="absolute -bottom-2 -right-2 w-10 h-10 text-aqua-500 animate-wave" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-ocean-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-ocean-500 mb-6">Thank you for shopping with AasaiPet! Your aquatic goodies are on their way.</p>

          {order && (
            <div className="bg-ocean-50 rounded-2xl p-4 text-left mb-6 text-sm">
              <div className="flex justify-between text-ocean-700 mb-2">
                <span className="font-medium">Order ID:</span>
                <span className="text-ocean-500 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-ocean-700 mb-2">
                <span className="font-medium">Amount Paid:</span>
                <span className="font-bold text-ocean-900">₹{order.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-ocean-700">
                <span className="font-medium">Items:</span>
                <span>{order.orderItems?.length} item(s)</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to={`/orders/${id}`} className="btn-primary flex items-center justify-center gap-2">
              <FiPackage /> Track Order <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="btn-secondary flex items-center justify-center gap-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
