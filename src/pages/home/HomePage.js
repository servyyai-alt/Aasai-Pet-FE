import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchFeaturedProducts,
  fetchCategories,
  fetchGalleryItems,
} from "../../utils/api";
import ProductCard from "../../components/common/ProductCard";
import GalleryGrid from "../../components/Gallery/GalleryGrid";
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiStar,
  FiRefreshCw,
  FiHeart,
} from "react-icons/fi";
import hero_pets from "../../assets/hero-pets.png";

/* ─── Floating background pets ─── */
const FLOATING_PETS = [
  "🐶",
  "🐱",
  "🐠",
  "🕊️",
  "🐰",
  "🦜",
  "🐹",
  "🐢",
  "🦎",
  "🐈",
  "🦮",
  "🐡",
];

/* ─── Category → visual config ─── */
const CATEGORY_CONFIG = {
  dogs: {
    emoji: "🐶",
    gradient: "from-amber-500 to-orange-400",
    ring: "hover:ring-amber-400",
  },
  cats: {
    emoji: "🐱",
    gradient: "from-purple-500 to-pink-400",
    ring: "hover:ring-purple-400",
  },
  fish: {
    emoji: "🐠",
    gradient: "from-cyan-500 to-blue-400",
    ring: "hover:ring-cyan-400",
  },
  birds: {
    emoji: "🕊️",
    gradient: "from-sky-500 to-indigo-400",
    ring: "hover:ring-sky-400",
  },
  rabbits: {
    emoji: "🐰",
    gradient: "from-pink-500 to-rose-400",
    ring: "hover:ring-pink-400",
  },
  reptiles: {
    emoji: "🦎",
    gradient: "from-emerald-500 to-teal-400",
    ring: "hover:ring-emerald-400",
  },
  hamsters: {
    emoji: "🐹",
    gradient: "from-yellow-500 to-amber-400",
    ring: "hover:ring-yellow-400",
  },
  accessories: {
    emoji: "🎾",
    gradient: "from-red-500 to-orange-400",
    ring: "hover:ring-red-400",
  },
  food: {
    emoji: "🦴",
    gradient: "from-lime-500 to-green-400",
    ring: "hover:ring-lime-400",
  },
  motors: {
    emoji: "⚙️",
    gradient: "from-slate-500 to-gray-400",
    ring: "hover:ring-slate-400",
  },
};
const DEFAULT_CFG = {
  emoji: "🐾",
  gradient: "from-violet-500 to-purple-400",
  ring: "hover:ring-violet-400",
};

const getPetConfig = (slug = "", name = "") => {
  if (CATEGORY_CONFIG[slug.toLowerCase()])
    return CATEGORY_CONFIG[slug.toLowerCase()];
  const n = name.toLowerCase();
  if (n.includes("dog")) return CATEGORY_CONFIG.dogs;
  if (n.includes("cat")) return CATEGORY_CONFIG.cats;
  if (n.includes("fish")) return CATEGORY_CONFIG.fish;
  if (n.includes("bird") || n.includes("dove") || n.includes("parrot"))
    return CATEGORY_CONFIG.birds;
  if (n.includes("rabbit") || n.includes("bunny"))
    return CATEGORY_CONFIG.rabbits;
  if (n.includes("reptile") || n.includes("lizard") || n.includes("turtle"))
    return CATEGORY_CONFIG.reptiles;
  if (n.includes("hamster") || n.includes("guinea"))
    return CATEGORY_CONFIG.hamsters;
  if (n.includes("food") || n.includes("treat")) return CATEGORY_CONFIG.food;
  if (n.includes("access") || n.includes("toy") || n.includes("collar"))
    return CATEGORY_CONFIG.accessories;
  return DEFAULT_CFG;
};

/* ─── Sub-components ─── */

const FloatingPet = ({ emoji, size, left, top, opacity, duration, delay }) => (
  <span
    className="absolute select-none pointer-events-none"
    style={{
      fontSize: size,
      left,
      top,
      opacity,
      animation: `floatPet ${duration}s ease-in-out ${delay}s infinite alternate`,
      filter: "blur(0.4px)",
    }}
  >
    {emoji}
  </span>
);

const StatBubble = ({ value, label, color }) => (
  <div className="flex flex-col items-center">
    <span className={`font-display text-3xl font-black ${color}`}>{value}</span>
    <span className="text-white/55 text-xs tracking-widest uppercase mt-0.5">
      {label}
    </span>
  </div>
);

const FeatureCard = ({ icon: Icon, title, sub, emoji, color, bg }) => (
  <div
    className={`${bg} border-2 border-white/70 rounded-2xl p-5 flex flex-col items-center text-center group hover:-translate-y-1.5 transition-all duration-300`}
  >
    <span className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
      {emoji}
    </span>
    <div className={`${color} mb-1`}>
      <Icon className="w-4 h-4 mx-auto" />
    </div>
    <h4 className="font-display font-black text-gray-800 text-sm">{title}</h4>
    <p className="text-gray-500 text-xs mt-1 leading-snug">{sub}</p>
  </div>
);

const CategoryCard = ({ cat }) => {
  const cfg = getPetConfig(cat.slug, cat.name);
  return (
    <Link
      to={`/products?category=${cat._id}`}
      className={`relative overflow-hidden text-white rounded-3xl p-6
        hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group
        ring-2 ring-transparent ${cfg.ring} border border-white/20 border-orange-300 bg-gradient-to-br ${cfg.gradient}`}
      
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-3xl" />
      <div className="relative z-10">
        <span className="text-5xl block mb-3 drop-shadow group-hover:scale-110 transition-transform duration-300">
          {cfg.emoji}
        </span>
        <h3 className="font-display font-black text-xl leading-tight">
          {cat.name}
        </h3>
        <p className="text-white/70 text-sm mt-1 line-clamp-1">
          {cat.description || "Shop now →"}
        </p>
      </div>
      <FiArrowRight className="absolute bottom-4 right-4 w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </Link>
  );
};

/* ═══════════════════════════════
   MAIN PAGE
═══════════════════════════════ */
const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [fp, fc, fg] = await Promise.all([
          fetchFeaturedProducts(),
          fetchCategories(),
          fetchGalleryItems(),
        ]);
        setFeatured(fp.data);
        setCategories(fc.data);
        setGalleryItems(fg.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const floaters = FLOATING_PETS.map((emoji, i) => ({
    emoji,
    size: `${1.8 + (i % 4) * 0.8}rem`,
    left: `${(i * 8.3) % 100}%`,
    top: `${(i * 13 + 5) % 88}%`,
    opacity: 0.1 + (i % 3) * 0.06,
    duration: 4 + (i % 5),
    delay: i * 0.4,
  }));

  const QUICK_PETS = [
    { emoji: "🐶", label: "Dogs", q: "Dogs" },
    { emoji: "🐱", label: "Cats", q: "Cats" },
    { emoji: "🐠", label: "Fish", q: "Fish" },
    { emoji: "🕊️", label: "Birds", q: "Birds" },
    { emoji: "🐰", label: "Rabbits", q: "Rabbits" },
    { emoji: "🐹", label: "Hamsters", q: "Hamsters" },
    { emoji: "🦎", label: "Reptiles", q: "Reptiles" },
    { emoji: "🦴", label: "Food", q: "Food" },
    { emoji: "🎾", label: "Accessories", q: "Accessories" },
  ];

  const MARQUEE_ITEMS = [
    "🐶 Dogs",
    "🐱 Cats",
    "🐠 Fish",
    "🕊️ Birds",
    "🐰 Rabbits",
    "🦜 Parrots",
    "🐹 Hamsters",
    "🦎 Reptiles",
    "🐢 Turtles",
    "🐈 Kittens",
    "🦮 Puppies",
    "🐡 Aquarium",
  ];

  return (
    <>
      <style>{`
        @keyframes floatPet {
          from { transform: translateY(0) rotate(-4deg); }
          to   { transform: translateY(-20px) rotate(4deg); }
        }
        @keyframes heroReveal {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.33%); }
        }
        @keyframes pawBlink {
          0%,100% { opacity:0; transform:scale(0.5) rotate(-10deg); }
          50%      { opacity:1; transform:scale(1) rotate(5deg); }
        }
        .hero-reveal > * {
          opacity:0;
          animation: heroReveal 0.65s ease forwards;
        }
        .hero-reveal > *:nth-child(1){animation-delay:.1s}
        .hero-reveal > *:nth-child(2){animation-delay:.25s}
        .hero-reveal > *:nth-child(3){animation-delay:.4s}
        .hero-reveal > *:nth-child(4){animation-delay:.55s}
        .hero-reveal > *:nth-child(5){animation-delay:.7s}
        .paw-blink span { display:inline-block; animation: pawBlink 2.2s ease-in-out infinite; }
        .paw-blink span:nth-child(2){animation-delay:.4s}
        .paw-blink span:nth-child(3){animation-delay:.8s}
        .paw-blink span:nth-child(4){animation-delay:1.2s}
      `}</style>

      <div className="overflow-x-hidden">
        {/* ─── HERO ─── */}
        <section
          className="relative min-h-[90vh] flex items-center overflow-hidden bg-ocean-gradient"
          style={{
            background:
              "linear-gradient(135deg, #e07b39 0%, #f0a04b 50%, #f6c177 100%)",
          }}
        >
          {/* floating pets bg */}
          {floaters.map((f, i) => (
            <FloatingPet key={i} {...f} />
          ))}

          {/* ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 65% 55% at 62% 38%,rgba(139,92,246,.2) 0%,transparent 68%)",
            }}
          />

          {/* bottom wave */}
          <div
            className="absolute bottom-0 hidden sm:block left-0 right-0 h-20 pointer-events-none"
            style={{
              background:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 80'%3E%3Cpath fill='%23f5f3ff' d='M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z'/%3E%3C/svg%3E\") no-repeat bottom/cover",
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* LEFT COPY */}
              <div className="hero-reveal">
                {/* badge */}
                <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-sm text-white font-medium mb-6">
                  <span className="paw-blink">
                    <span>🐾</span>
                    <span>🐾</span>
                    <span>🐾</span>
                    <span>🐾</span>
                  </span>
                  Your One-Stop Pet Paradise
                </div>

                {/* headline */}
                <h1
                  className="font-display font-bold leading-[1.06] text-white mb-5"
                  style={{ fontSize: "clamp(2.5rem,5.5vw,4.8rem)" }}
                >
                  Every Pet
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(90deg,#f9a8d4,#c4b5fd,#93c5fd)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Deserves
                  </span>{" "}
                  the Best 🐾
                </h1>

                {/* body */}
                <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-lg">
                  Premium food, accessories &amp; supplies for{" "}
                  <strong className="text-white/90">
                    dogs, cats, fish, birds, rabbits
                  </strong>{" "}
                  and all your beloved companions — delivered with love.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 mb-10">
                  <Link
                    to="/products"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-purple-900 shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
                    // style={{
                    //   background: "linear-gradient(135deg,#f9a8d4,#c4b5fd)",
                    // }}
                  >
                    Shop Now <FiArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/products?featured=true"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white border border-white/30 bg-white/10 backdrop-blur hover:bg-white/20 transition-all duration-300"
                  >
                    View Featured
                  </Link>
                </div>

                {/* stats */}
                <div className="flex gap-10">
                  <StatBubble
                    value="500+"
                    label="Products"
                    color="text-white"
                  />
                  <StatBubble
                    value="15K+"
                    label="Happy Pets"
                    color="text-white"
                  />
                  <StatBubble value="4.9★" label="Rating" color="text-white" />
                </div>
              </div>

              {/* RIGHT — pet orbit */}
              {/* <div className="hidden lg:flex justify-center items-center">
                <div className="relative w-96 h-96">
                  <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                      background:
                        "radial-gradient(circle,rgba(167,139,250,.28) 0%,transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute inset-4 rounded-full border-2 border-white/10 animate-spin"
                    style={{ animationDuration: "18s" }}
                  />

                  <div
                    className="absolute inset-16 rounded-full flex items-center justify-center text-7xl"
                    style={{
                      background: "rgba(255,255,255,.07)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,.15)",
                    }}
                  >
                    🐾
                  </div>

                  {[
                    { emoji: "🐶", angle: 0 },
                    { emoji: "🐱", angle: 60 },
                    { emoji: "🐠", angle: 120 },
                    { emoji: "🕊️", angle: 180 },
                    { emoji: "🐰", angle: 240 },
                    { emoji: "🦜", angle: 300 },
                  ].map(({ emoji, angle }) => {
                    const rad = (angle * Math.PI) / 180;
                    const r = 148;
                    const x = 50 + (r / 3.84) * Math.cos(rad);
                    const y = 50 + (r / 3.84) * Math.sin(rad);
                    return (
                      <span
                        key={angle}
                        className="absolute text-4xl select-none"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%,-50%)",
                          filter: "drop-shadow(0 2px 8px rgba(0,0,0,.4))",
                          animation: `floatPet ${3 + angle / 100}s ease-in-out ${angle / 300}s infinite alternate`,
                        }}
                      >
                        {emoji}
                      </span>
                    );
                  })}
                </div>
              </div> */}
              <img
                src={hero_pets}
                alt="Happy pets"
                className="w-full max-w-md mx-auto animate-fadeIn"
              />
            </div>
          </div>
        </section>

        {/* ─── FEATURE STRIP ─── */}
        <section className="py-12 bg-gradient-to-b from-violet-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: FiTruck,
                  title: "Free Delivery",
                  sub: "Orders above ₹999",
                  emoji: "🚚",
                  color: "text-orange-500",
                  bg: "bg-orange-50",
                },
                {
                  icon: FiShield,
                  title: "Secure Payment",
                  sub: "Razorpay protected",
                  emoji: "🔒",
                  color: "text-violet-500",
                  bg: "bg-violet-50",
                },
                {
                  icon: FiStar,
                  title: "Vet-Approved",
                  sub: "Quality checked products",
                  emoji: "⭐",
                  color: "text-amber-500",
                  bg: "bg-amber-50",
                },
                {
                  icon: FiRefreshCw,
                  title: "Easy Returns",
                  sub: "7-day hassle-free",
                  emoji: "🔄",
                  color: "text-teal-500",
                  bg: "bg-teal-50",
                },
              ].map((p) => (
                <FeatureCard key={p.title} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* ─── QUICK PET-TYPE PILLS ─── */}
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-400 text-xs uppercase tracking-widest mb-6 font-semibold">
              Shop by Pet Type
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {QUICK_PETS.map(({ emoji, label, q }) => (
                <div
                  key={label}
                  to={`/products?search=${q}`}
                  className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl border-2 border-gray-100 hover:border-violet-300 hover:bg-violet-50 transition-all duration-200 group min-w-[72px]"
                >
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-200">
                    {emoji}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 group-hover:text-violet-600">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── GALLERY ─── */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-[2px] w-8 bg-pink-500"></span>
                  <p className="text-pink-500 font-bold text-xs uppercase tracking-[0.2em]">
                    Curated Collection
                  </p>
                </div>
                <h2 className="font-display font-black text-5xl text-gray-900 tracking-tight">
                  Gallery
                </h2>
              </div>
              {/* <div className="flex items-center gap-3 text-gray-400 group cursor-default">
                <span className="text-xs font-bold uppercase tracking-widest group-hover:text-pink-500 transition-colors">
                  Tap to explore resources
                </span>
                <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-pink-500 group-hover:text-pink-500 transition-all">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div> */}
            </div>

            {/* The Interactive Grid */}
            <GalleryGrid items={galleryItems} loading={loading} />
          </div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="py-20 bg-gradient-to-b from-white to-violet-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-violet-500 font-bold text-xs uppercase tracking-widest mb-1">
                  Browse By
                </p>
                <h2 className="font-display font-black text-4xl text-gray-900">
                  Categories
                </h2>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-400 transition-colors"
              >
                View all <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
              {categories.length > 0
                ? categories.map((cat) => (
                    <CategoryCard key={cat._id} cat={cat} />
                  ))
                : [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-40 rounded-3xl bg-gradient-to-br from-violet-100 to-pink-100 animate-pulse"
                    />
                  ))}
            </div>
          </div>
        </section>

        {/* ─── FEATURED PRODUCTS ─── */}
        <section className="py-20 bg-violet-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-pink-500 font-bold text-xs uppercase tracking-widest mb-1">
                  Handpicked For You
                </p>
                <h2 className="font-display font-black lg:text-4xl text-2xl text-gray-900">
                  Featured Products
                </h2>
              </div>
              <Link
                to="/products"
                className="flex items-center gap-1 text-sm font-semibold text-violet-600 hover:text-violet-400 transition-colors"
              >
                View all <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 animate-pulse"
                  />
                ))}
              </div>
            ) : featured.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <span className="text-6xl block mb-4 animate-bounce">🐾</span>
                <p className="font-display text-xl font-bold text-gray-600 mb-1">
                  No featured products yet
                </p>
                <p className="text-sm">
                  Check back soon — our shelves are filling up!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ─── MARQUEE STRIP ─── */}
        <div
          className="py-4 overflow-hidden"
           style={{
            background:
              "linear-gradient(135deg, #e07b39 0%, #f0a04b 50%, #f6c177 100%)",
          }}
        >
          <div
            className="flex gap-6 whitespace-nowrap"
            style={{ animation: "marqueeScroll 20s linear infinite" }}
          >
            {[...Array(3)].flatMap((_, pass) =>
              MARQUEE_ITEMS.map((label, i) => (
                <span
                  key={`${pass}-${i}`}
                  className="text-white/85 font-bold text-sm tracking-wide"
                >
                  {label} &nbsp;•&nbsp;
                </span>
              )),
            )}
          </div>
        </div>

        {/* ─── WHY US ─── */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-violet-500 font-bold text-xs uppercase tracking-widest mb-2">
                Why Pet Parents Love Us
              </p>
              <h2 className="font-display font-black text-4xl text-gray-900">
                Built for Every Animal Lover
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  emoji: "🧬",
                  title: "Vet-Tested Quality",
                  desc: "Every product goes through strict quality checks — because your pet's health is non-negotiable.",
                  color: "bg-violet-50 border-violet-100",
                },
                {
                  emoji: "❤️",
                  title: "Made with Pet Love",
                  desc: "Our team of pet parents curates products they actually use for their own furry, feathery and scaly family.",
                  color: "bg-pink-50 border-pink-100",
                },
                {
                  emoji: "🌿",
                  title: "Eco-Friendly Options",
                  desc: "We partner with sustainable brands so you can care for your pets while caring for the planet.",
                  color: "bg-green-50 border-green-100",
                },
              ].map(({ emoji, title, desc, color }) => (
                <div
                  key={title}
                  className={`${color} border-2 rounded-3xl p-8 hover:-translate-y-1 transition-all duration-300`}
                >
                  <span className="text-5xl block mb-4">{emoji}</span>
                  <h3 className="font-display font-black text-xl text-gray-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section
          className="py-24 relative overflow-hidden bg-slate-950"
          style={{
            background: `linear-gradient(145deg, #FF9B45 0%, #E07B39 100%)`,
          }}
        >
          {/* 1. Large background image (for depth) */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Happy dog and cat together"
              className="w-full h-full object-cover opacity-15 scale-105"
            />
            <div className="absolute inset-0 bg-[#E07B39]/50 mix-blend-overlay"></div>
          </div>

          {/* 2. Floating Decorative Pet Icons (Improved Positioning/Animation) */}
          {["🐶", "🐱", "🐠", "🕊️", "🐰", "🐾", "🦮", "🐱‍👤", "🐹", "🦴"].map(
            (e, i) => (
              <span
                key={i}
                className="absolute select-none pointer-events-none z-1"
                style={{
                  fontSize: `${3 + (i % 3)}rem`,
                  opacity: 0.15,
                  left: `${(i * 12 + 5) % 100}%`,
                  top: `${(i * 18 + 10) % 100}%`,
                  transform: `rotate(${i * 15}deg)`,
                  animation: `floatPet ${6 + i}s ease-in-out ${i * 0.4}s infinite alternate`,
                }}
              >
                {e}
              </span>
            ),
          )}

          {/* 3. Integrated Subject Images (The "Pop" Elements) */}

          {/* Front Left Cat (Candid and Cute) */}
          <div className="absolute -left-12 -bottom-28 z-20 w-80 h-auto select-none pointer-events-none scale-x-[-1] animate-fade-in-up">
            <img
              src="https://images.unsplash.com/photo-1560714859-99f57c6314f2?q=80&w=600&auto=format&fit=crop"
              alt="Smiling happy orange cat"
              className="mask-fade-bottom scale-x-[-1]"
            />
          </div>

          {/* Back Right Dog (Alert and Loving) */}
          <div className="absolute -right-24 bottom-10 z-0 w-[420px] h-auto select-none pointer-events-none animate-fade-in-down delay-150">
            <img
              src={hero_pets}
              alt="Golden retriever puppy sitting down"
              className="opacity-70 contrast-125"
            />
          </div>

          {/* 4. The Content (Z-indexed above images) */}
          <div className="relative z-30 max-w-4xl mx-auto px-4">
            {/* Main Content Card */}
            <div className="text-center backdrop-blur-sm bg-white/5 border border-white/10 p-12 rounded-[40px] shadow-[0_25px_50px_-12px_rgba(224,123,57,0.4)]">
              <span className="text-6xl block mb-6 animate-pulse">🐾</span>

              <h2
                className="font-display font-black text-white mb-6 leading-tight drop-shadow-lg"
                style={{ fontSize: "clamp(2.5rem,5.5vw,4.2rem)" }}
              >
                Your Pet Deserves{" "}
                <span className="text-orange-950/70">the Very Best</span>
              </h2>

              <p className="max-w-2xl mx-auto text-orange-950 text-xl font-medium mb-12 leading-relaxed opacity-90">
                Join{" "}
                <strong className="text-white">
                  15,000+ happy pet parents
                </strong>{" "}
                who trust PetMart for premium nutrition, accessories, and
                expert-approved products.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <Link
                  to="/products"
                  className="group flex items-center justify-center gap-2.5 px-12 py-5 rounded-2xl font-extrabold text-xl text-[#E07B39] hover:text-white transition-all duration-300 shadow-[0_10px_20px_rgba(224,123,57,0.5)] bg-white hover:bg-orange-600 scale-100 hover:scale-105 active:scale-95"
                >
                  <FiHeart className="w-6 h-6 group-hover:fill-white" /> Shop
                  All Pets
                </Link>

                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2.5 px-12 py-5 rounded-2xl font-extrabold text-white border-2 border-white/60 bg-white/10 backdrop-blur hover:bg-white/30 hover:border-white transition-all duration-300"
                >
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>

          {/* Tailwind and custom CSS animation support */}
          <style>{`
        @keyframes floatPet {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 1s ease-out; }
        .mask-fade-bottom {
          -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
        }
      `}</style>
        </section>
      </div>
    </>
  );
};

export default HomePage;
