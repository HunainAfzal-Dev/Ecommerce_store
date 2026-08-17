import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { productApi, categoryApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import type { Product, Category } from '../types';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productApi.getAll(),
          categoryApi.getAll()
        ]);
        setFeaturedProducts(productsRes.data.data.products || []);
        setCategories(categoriesRes.data.data.categories || []);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Thank you for subscribing to our seasonal gazette.', 'success');
    setNewsletterEmail('');
  };

  if (loading) return <Loader message="Curating collection..." />;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Editorial Hero Section */}
      <section className="relative bg-[#f5f4ef] border-b border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-stone-900 text-white text-[10px] uppercase tracking-[0.25em] font-semibold px-3 py-1.5 rounded-none">
              <span>New Season Edition</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-normal tracking-tight leading-[1.1]">
              Refined Silhouettes, <br />
              <span className="italic font-light">Timeless Comfort</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed max-w-lg">
              Explore our latest collection of contemporary garments crafted from pure breathable fabrics, tailored for effortless daily elegance.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 transition-all duration-200"
              >
                Shop Collection
              </Link>
              <Link
                to="/shop"
                className="border border-stone-900 hover:bg-stone-900 hover:text-white text-stone-900 text-xs uppercase tracking-widest font-semibold px-8 py-4 transition-all duration-200"
              >
                View Lookbook
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-y border-stone-200/80 py-8">
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900">
              Pure Natural Fabrics
            </h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              100% fine cottons, linens, and breathable blends.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900">
              Artisanal Tailoring
            </h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Meticulous cuts designed for drape and longevity.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900">
              Express Shipping
            </h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Complimentary delivery on orders over Rs. 5,000.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900">
              Seamless Exchanges
            </h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Hassle-free 7-day doorstep size replacement.
            </p>
          </div>
        </div>
      </section>

      {/* Shop by Category Showcase */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                Curated Departments
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-1">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-stone-600 transition mt-2 sm:mt-0"
            >
              Explore All Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group relative bg-white border border-stone-200 p-6 sm:p-8 flex flex-col justify-between min-h-[160px] hover:border-stone-950 transition-all duration-300"
              >
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">
                    Department
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-stone-900 group-hover:text-stone-600 transition">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-stone-500 line-clamp-2 font-light">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-900">
                  <span>View Department</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured / Latest Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
              The Latest Drop
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal mt-1">
              Latest Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest font-semibold text-stone-900 hover:text-stone-600 transition mt-2 sm:mt-0"
          >
            View Complete Collection &rarr;
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-stone-200">
            <p className="text-sm text-stone-500 font-light">
              No garments available in this collection yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {/* Brand Ethos / Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white p-8 sm:p-16 lg:p-20 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 font-semibold">
              The Philosophy
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
              Designed for ease. <br />
              Tailored for perpetuity.
            </h2>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            <p>
              We believe in wardrobe essentials that transcend fleeting trends. Each garment is drafted with thoughtful proportion, durable seams, and rich textural fabrics that grow softer with every wear.
            </p>
            <div>
              <Link
                to="/shop"
                className="inline-block text-xs uppercase tracking-widest font-semibold text-white border-b border-white pb-1 hover:text-stone-300 hover:border-stone-300 transition"
              >
                Discover the Craft &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Newsletter */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center space-y-4">
        <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
          The Atelier Gazette
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
          Receive Early Access to Releases
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto">
          Subscribe for private drop notifications, seasonal styling notes, and private archive sales.
        </p>

        <form onSubmit={handleNewsletterSubmit} className="pt-4 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 rounded-none"
          />
          <button
            type="submit"
            className="bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 transition"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
