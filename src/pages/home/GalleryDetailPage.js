import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchGalleryItem, fetchGalleryItems } from '../../utils/api'; // Corrected name
import { FiArrowLeft, FiCheck, FiInfo, FiTag, FiStar } from 'react-icons/fi';
import { GiTropicalFish, GiAnchor, GiWaterDrop } from 'react-icons/gi';

const GalleryDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [backgroundPets, setBackgroundPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // 1. Fetch the main gallery item
    fetchGalleryItem(id)
      .then((r) => setItem(r.data))
      .catch(() => setItem(null))
      .finally(() => setLoading(false));

    // 2. Fetch background pets using the correct function: fetchGalleryItems
    fetchGalleryItems()
      .then((r) => {
        // Filter out the current pet and pick random ones for the background
        const others = r.data
          .filter(p => p._id !== id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setBackgroundPets(others);
      })
      .catch(() => setBackgroundPets([]));
  }, [id]);

  const product = useMemo(() => item?.productId || null, [item]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
        <div className="relative">
          <GiTropicalFish className="text-6xl text-blue-500 animate-bounce" />
          <div className="absolute -top-4 -right-4">
             <GiWaterDrop className="text-2xl text-cyan-400 animate-ping" />
          </div>
        </div>
        <p className="mt-4 font-bold text-blue-600 animate-pulse">Diving deep for your data...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-blue-400 bg-blue-50">
        <FiStar className="text-6xl mb-4 opacity-50 text-yellow-400 animate-spin-slow" />
        <h2 className="text-2xl font-black text-blue-900">Oops! This treasure is lost.</h2>
        <Link to="/" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg transition-all">
          Go Back Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-white to-cyan-50 pb-20 relative overflow-hidden">
      
      {/* --- Dynamic Background Pets Layer --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {backgroundPets.map((pet, index) => (
          <div 
            key={pet._id || index}
            className="absolute transition-opacity duration-1000 animate-pulse"
            style={{
              top: `${15 + (index * 18)}%`,
              left: index % 2 === 0 ? `${Math.random() * 10}%` : `${80 + Math.random() * 5}%`,
              opacity: 0.12,
              transform: `scale(${0.7 + Math.random()}) rotate(${index * 45}deg)`,
            }}
          >
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img 
                src={pet.mediaUrl} 
                alt="Underwater friend" 
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <GiWaterDrop className="text-blue-300 absolute -top-4 right-0 text-xl" />
          </div>
        ))}
      </div>

      {/* --- Foreground Content --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-pink-500 mb-8 transition-all group"
        >
          <div className="p-2 rounded-full bg-white/80 shadow-md group-hover:scale-110 transition-transform border border-blue-100 backdrop-blur-sm">
            <FiArrowLeft strokeWidth={3} />
          </div>
          <span className="drop-shadow-sm">Back to the Ocean</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Media Section */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-[2.5rem] blur opacity-30"></div>
            <div className="relative rounded-[2rem] overflow-hidden bg-white ring-8 ring-white shadow-2xl">
              <div className="aspect-[4/3] w-full">
                {item.mediaType === 'video' ? (
                  <video 
                    className="w-full h-full object-cover" 
                    src={item.mediaUrl} 
                    controls 
                    playsInline 
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <img className="w-full h-full object-cover" src={item.mediaUrl} alt={item.title} />
                )}
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-blue-900 font-black px-6 py-2 rounded-2xl shadow-lg transform rotate-3 flex items-center gap-2 border-4 border-white">
              <GiTropicalFish className="text-xl" />
              {item.mediaType === 'video' ? 'WATCH!' : 'LOOK!'}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:pt-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                Discovery
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-6 leading-tight drop-shadow-sm">
              {item.title}
            </h1>
            
            <div className="relative mb-10 border-l-4 border-cyan-400 pl-6 bg-white/40 backdrop-blur-sm py-4 rounded-r-2xl">
              <p className="text-blue-700 text-lg leading-relaxed italic">
                {item.description || "Every fish has a story! Explore this wonderful aquatic treasure."}
              </p>
            </div>

            {/* <div className="bg-white/80 backdrop-blur-md rounded-[2rem] border-2 border-white shadow-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <GiAnchor className="text-8xl text-blue-900" />
                </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500 rounded-2xl text-white shadow-lg">
                    <FiTag size={24} />
                </div>
                <h2 className="text-2xl font-black text-blue-900 uppercase">Pet Profile</h2>
              </div>

              {!product ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl text-blue-400 font-medium border border-dashed border-blue-200">
                  <FiInfo /> Information coming soon!
                </div>
              ) : (
                <>
                  <p className="text-pink-500 font-bold text-sm uppercase mb-1">
                    {product.category?.name || 'Ocean Wonders'}
                  </p>
                  <h3 className="text-3xl font-black text-blue-900 mb-4">{product.name}</h3>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-yellow-400 px-5 py-2 rounded-2xl shadow-inner border-2 border-yellow-500/20">
                        <span className="text-3xl font-black text-blue-900">
                        ₹{Number(product.discountPrice || product.price || 0).toLocaleString()}
                        </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className={`flex items-center justify-center gap-2 p-3 rounded-2xl font-black text-sm shadow-sm ${Number(product.stock || 0) > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                      {Number(product.stock || 0) > 0 ? (
                        <><FiCheck strokeWidth={4} /> {product.stock} Ready!</>
                      ) : (
                        'Sold Out'
                      )}
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
                        <GiTropicalFish className="text-cyan-500" /> Marine Life
                    </div>
                  </div>

                  {product.specifications && product.specifications.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-black text-blue-800 text-sm uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pink-500" /> Quick Facts
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.specifications.map((s, i) => (
                          <div key={i} className="bg-white/60 border border-blue-50 rounded-2xl p-3 shadow-sm">
                            <dt className="text-[10px] uppercase font-black text-blue-400 mb-1 leading-none">{s.key}</dt>
                            <dd className="font-bold text-blue-800 text-sm">{s.value}</dd>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div> */}

            {/* Footer Tag */}
            <div className="mt-8 p-4 bg-blue-900 rounded-2xl shadow-lg flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <GiWaterDrop className="text-white text-4xl" />
              </div>
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 p-2 rounded-xl">
                    <GiAnchor className="w-5 h-5 text-cyan-300" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Explorer View</span>
              </div>
              <span className="text-[10px] text-blue-300 font-bold bg-white/10 px-3 py-1 rounded-full uppercase tracking-tighter z-10">Ocean Explorer Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetailPage;