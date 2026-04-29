import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#0369a1', color: '#fff', borderRadius: '12px', fontFamily: 'Plus Jakarta Sans' },
            success: { style: { background: '#0891b2' } },
            error: { style: { background: '#dc2626' } },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
