import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const WhatsAppFloat = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const message = 'Thank you choosing Aasai pet shop. How can I help you?';
  const phone = process.env.REACT_APP_WHATSAPP_NUMBER || '919171401515';
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-20 right-0 w-60 rounded-2xl p-3 shadow-2xl bg-white border border-gray-200"
        >
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
            style={{ background: '#6b7280' }}
            aria-label="Close WhatsApp tooltip"
          >
            <FaTimes />
          </button>
          <p className="text-gray-700 text-xs font-medium leading-snug">
            Chat with us on WhatsApp.
          </p>
        </div>
      )}

      {/* Button */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 relative"
        style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 30px rgba(37,211,102,0.5)' }}
        onClick={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
        {/* Ping ring */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ background: '#25D366' }} />
      </a>
    </div>
  );
};

export default WhatsAppFloat;
