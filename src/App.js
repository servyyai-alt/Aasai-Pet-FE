import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/home/ProductsPage';
import ProductDetailPage from './pages/home/ProductDetailPage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import UserDashboard from './pages/user/UserDashboard';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import OrderDetailPage from './pages/user/OrderDetailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import NotFoundPage from './pages/home/NotFoundPage';
import WhatsAppFloat from './components/common/WhatsappFloat';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-ocean-50">
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/products/new" element={<AdminProductForm />} />
                <Route path="/products/edit/:id" element={<AdminProductForm />} />
                <Route path="/orders" element={<AdminOrders />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/categories" element={<AdminCategories />} />
                <Route path="/analytics" element={<AdminAnalytics />} />
              </Routes>
            </AdminRoute>
          } />
          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                  <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                  <Route path="/dashboard/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
              <WhatsAppFloat />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
