import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiShield } from 'react-icons/fi';

const ContactPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-aqua-600 font-bold text-xs uppercase tracking-widest mb-1">Support</p>
          <h1 className="font-display text-3xl font-black text-ocean-900">Contact Us</h1>
          <p className="text-ocean-500 text-sm mt-2">We typically respond within 24–48 hours.</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-violet-600 hover:text-violet-400 transition-colors">
          Back to Home
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-6">
          <h2 className="font-display text-xl font-black text-ocean-900 mb-4">Customer Support</h2>
          <div className="space-y-3 text-ocean-700 text-sm">
            <div className="flex items-start gap-2">
              <FiMapPin className="w-4 h-4 mt-0.5 text-ocean-500" />
              <p>சங்கனூர் நல்லாம்பாளையம் ரோடு கதவு எண் 3/1-3 கோயமுத்தூர் 641027</p>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="w-4 h-4 text-ocean-500" />
              <p>+91 82205 39620</p>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className="w-4 h-4 text-ocean-500" />
              <p>aasairajkumar1515@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-6">
          <h2 className="font-display text-xl font-black text-ocean-900 mb-4">Payment &amp; Security</h2>
          <div className="text-ocean-700 text-sm leading-relaxed space-y-3">
            <p className="flex items-start gap-2">
              <FiShield className="w-4 h-4 mt-0.5 text-ocean-500" />
              Payments are processed securely via Razorpay. We do not store complete card/bank details on our servers.
            </p>
            <p className="text-ocean-500 text-xs">
              For payment issues, share your order ID and Razorpay payment reference to help us resolve faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

