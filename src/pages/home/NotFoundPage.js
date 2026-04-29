import React from 'react';
import { Link } from 'react-router-dom';
import { GiTropicalFish } from 'react-icons/gi';

const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
    <div className="relative mb-6">
      <div className="text-9xl font-display font-bold text-ocean-100">404</div>
      <GiTropicalFish className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-aqua-400 animate-float" />
    </div>
    <h1 className="font-display text-3xl font-bold text-ocean-900 mb-3">Page Not Found</h1>
    <p className="text-ocean-400 mb-8 max-w-sm">Looks like this fish swam away! The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFoundPage;
