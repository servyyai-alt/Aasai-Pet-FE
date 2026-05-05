import React from 'react';
import GalleryItem from './GalleryItem';

const GalleryGrid = ({ items = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-10 text-gray-400">
        <span className="text-5xl block mb-3">🖼️</span>
        <p className="font-display text-lg font-bold text-gray-700">No gallery items yet</p>
        <p className="text-sm">Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <GalleryItem key={item._id} item={item} />
      ))}
    </div>
  );
};

export default GalleryGrid;

