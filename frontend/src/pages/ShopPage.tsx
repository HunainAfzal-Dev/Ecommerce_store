import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productApi, categoryApi } from '../api/client';
import type { Product, Category } from '../types';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: { category_id?: string; search?: string } = {};
        if (activeCategory) params.category_id = activeCategory;
        if (search) params.search = search;

        const res = await productApi.getAll(params);
        setProducts(res.data.data.products || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeCategory, search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getAll();
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
              The Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight mt-1">
              {activeCategoryName || 'All Garments'}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search garments by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
            />
            <svg
              className="w-4 h-4 text-stone-400 absolute left-3 top-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 text-xs"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('')}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
              activeCategory === ''
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            All Pieces ({products.length})
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${
                activeCategory === category.id
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {loading ? (
          <Loader message="Loading catalog..." />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-xl p-8 shadow-xs">
            <p className="text-2xl font-bold text-stone-700 mb-2">No Pieces Found</p>
            <p className="text-xs text-stone-500 font-normal max-w-sm mx-auto mb-6">
              We could not find any garments matching your current search criteria or category filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                handleCategoryChange('');
              }}
              className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-lg transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
