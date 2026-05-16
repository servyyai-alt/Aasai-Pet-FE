import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../../utils/api';
import ProductCard from '../../components/common/ProductCard';
import { FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';
import { GiTropicalFish } from 'react-icons/gi';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchCategories().then(r => setCategories(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
        const { data } = await fetchProducts({ ...params, limit: 12, skip: 0 });
        setProducts(data.products);
        setTotal(data.total);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [filters]);

  const updateFilter = (key, value) => setFilters(f => ({ ...f, [key]: value }));

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const canLoadMore = !loading && products.length > 0 && products.length < total;

  const loadMore = async () => {
    if (loadingMore || !canLoadMore) return;
    setLoadingMore(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await fetchProducts({ ...params, limit: 15, skip: products.length });
      setProducts(prev => [...prev, ...(data.products || [])]);
      if (typeof data.total === 'number') setTotal(data.total);
    } catch (e) { console.error(e); }
    finally { setLoadingMore(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title-coral">All Products</h1>
          <p className="text-orange-500 mt-1">{total} products found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 btn-secondary-coral text-sm">
          <FiFilter /> Filters
        </button>
      </div>

      <div className="sm:flex gap-6 transition-all duration-300">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block sm:w-64 flex-shrink-0 transition-all duration-500  ease-in-out`}>
          <div className="card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-orange-950">Filters</h3>
              <button onClick={() => setFilters({ search: '', category: '', sort: '', minPrice: '', maxPrice: '' })}
                className="text-xs text-orange-400 hover:text-red-500">Clear All</button>
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-orange-800 mb-2">Search</label>
              <div className="relative">
                <input type="text" placeholder="Search products..." value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  className="input-field-coral text-sm pl-9 py-2.5" />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300 w-4 h-4" />
                {filters.search && <button onClick={() => updateFilter('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2"><FiX className="w-4 h-4 text-orange-300" /></button>}
              </div>
            </div>

            {/* Category */}
            <div className="mb-5 ">
              <label className="block text-sm font-medium text-orange-800 mb-2">Category</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="cat" value="" checked={filters.category === ''} onChange={e => updateFilter('category', e.target.value)} className="accent-orange-500" />
                  <span className="text-sm text-orange-800">All Categories</span>
                </label>
                <div className='grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1'>
                {categories.map(c => (
                  <label key={c._id} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="cat" value={c._id} checked={filters.category === c._id} onChange={e => updateFilter('category', e.target.value)} className="accent-orange-500" />
                    <span className="text-sm text-orange-800">{c.name}</span>
                  </label>
                ))}</div>
              </div>
            </div>

            {/* Price Range
            <div className="mb-5">
              <label className="block text-sm font-medium text-ocean-700 mb-2">Price Range (₹)</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="input-field text-sm py-2 w-1/2" />
                <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="input-field text-sm py-2 w-1/2" />
              </div>
            </div> */}

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-2">Sort By</label>
              <div className="relative">
                <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="input-field-coral text-sm py-2.5 appearance-none">
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(9)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {canLoadMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className={`btn-secondary-coral text-sm px-8 py-3 rounded-xl ${loadingMore ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-orange-500">
              <GiTropicalFish className="w-16 h-16 mx-auto mb-4 animate-float" />
              <h3 className="font-display text-xl font-bold text-orange-800 mb-2">No products found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
