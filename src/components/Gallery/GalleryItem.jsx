import React from 'react';
import { Link } from 'react-router-dom';

const GalleryItem = ({ item }) => {
  if (!item) return null;

  return (
    <Link
      to={`/gallery/${item._id}`}
      className="group relative block overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="aspect-[4/3] w-full overflow-hidden">
        {item.mediaType === 'video' ? (
          <video
            className="h-full w-full object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-500"
            src={item.mediaUrl}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay
          />
        ) : (
          <img
            className="h-full w-full object-cover scale-[1.01] group-hover:scale-105 transition-transform duration-500"
            src={item.mediaUrl}
            alt={item.title || 'Gallery item'}
            loading="lazy"
          />
        )}
      </div>
    </Link>
  );
};

export default GalleryItem;

