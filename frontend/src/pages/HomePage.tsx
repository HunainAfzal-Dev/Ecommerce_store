import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard, { getCategoryTheme } from '../components/ProductCard';
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
    showToast('Thank you for subscribing to our seasonal updates.', 'success');
    setNewsletterEmail('');
  };

  if (loading) return <Loader message="Curating collection..." />;

  return (
    <div className="space-y-10 sm:space-y-16 overflow-hidden">
      {/* 1. Editorial Hero Section - Mobile optimized typography & buttons */}
      <section className="relative bg-[var(--color-surface-subtle)] border-b border-stone-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] sm:text-xs uppercase tracking-widest font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>New Season Edition</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl text-stone-950 font-extrabold tracking-tight leading-[1.15]">
              Refined Silhouettes, <br />
              <span className="text-[var(--color-accent)] font-bold">Timeless Comfort</span>
            </h1>

            <p className="text-xs sm:text-base text-stone-600 font-normal leading-relaxed max-w-lg">
              Explore our curated garments crafted from pure breathable natural fabrics, tailored for effortless daily wear and understated modern luxury.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/shop"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] text-white text-xs uppercase tracking-wider font-bold px-6 py-4 rounded-xl shadow-sm text-center transition min-h-[48px] flex items-center justify-center"
              >
                Shop Collection
              </Link>
              <Link
                to="/shop"
                className="bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 border border-stone-300 text-xs uppercase tracking-wider font-bold px-6 py-4 rounded-xl shadow-2xs text-center transition min-h-[48px] flex items-center justify-center"
              >
                View Catalog &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CARDS DIRECTLY BELOW HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Latest Drop
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl text-stone-950 font-extrabold tracking-tight mt-0.5">
              Featured Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider font-bold text-stone-700 hover:text-stone-950 transition flex items-center gap-1 group py-1"
          >
            <span>View Complete Collection</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-xl shadow-xs">
            <p className="text-xs text-stone-500 font-normal">
              No garments available in this collection yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {/* 3. Shop by Category Showcase */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-stone-200 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-700">
                  Departments
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl text-stone-950 font-extrabold tracking-tight mt-0.5">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-bold text-stone-700 hover:text-stone-950 transition flex items-center gap-1 group py-1"
            >
              <span>Explore All Categories</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {categories.slice(0, 8).map((category, idx) => {
              const theme = getCategoryTheme(category.name, idx);
              return (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="group bg-white border border-stone-200/90 rounded-xl p-4 sm:p-6 flex flex-col justify-between min-h-[130px] sm:min-h-[150px] hover:border-stone-400 shadow-xs hover:shadow-sm active:bg-stone-50 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold ${theme.text} ${theme.bg} border ${theme.border} px-1.5 sm:px-2 py-0.5 rounded-md`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`}></span>
                        Department
                      </span>
                    </div>

                    <h3 className={`text-sm sm:text-base font-bold text-stone-950 ${theme.hoverText} transition-colors truncate`}>
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-2 font-normal leading-relaxed hidden xs:block">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className={`pt-2 sm:pt-3 flex items-center justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider ${theme.text}`}>
                    <span>Explore</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Brand Value Pillars - Mobile stacked layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-8 shadow-xs">
          <div className="flex items-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                Pure Natural Fabrics
              </h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                100% fine cottons, rich linens, and breathable natural blends.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.386l3.35-1.97a2.25 2.25 0 00.902-1.258l1.493-6.027a2.25 2.25 0 00-.594-2.146L11.16 3.66A2.25 2.25 0 009.568 3z" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                Artisanal Tailoring
              </h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Meticulous cuts designed for drape, silhouette, and longevity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 0A2.25 2.25 0 0012 1.5H6a2.25 2.25 0 00-2.25 2.25v13.5" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                Express Shipping
              </h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Complimentary nationwide delivery on orders over Rs. 5,000.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                Doorstep Exchanges
              </h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                Hassle-free 7-day doorstep size replacement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Ethos Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--color-primary)] text-white p-6 sm:p-12 lg:p-16 rounded-2xl grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]"></span>
              <span className="text-xs uppercase tracking-widest text-[var(--color-accent-border)] font-bold">
                The Atelier Philosophy
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Designed for ease. <br />
              <span className="text-[var(--color-accent-border)] font-medium">Tailored for perpetuity.</span>
            </h2>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
            <p>
              We believe in wardrobe essentials that transcend fleeting trends. Each garment is drafted with thoughtful proportion, durable seams, and rich textural fabrics that grow softer with every wear.
            </p>
            <div>
              <Link
                to="/shop"
                className="inline-block text-xs uppercase tracking-wider font-bold text-white border-b-2 border-[var(--color-accent)] pb-1 hover:text-[var(--color-accent-border)] transition"
              >
                Discover the Craft &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Minimalist Newsletter - Mobile stacked form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">
          Stay Connected
        </span>
        <h2 className="text-2xl sm:text-3xl text-stone-950 font-extrabold tracking-tight">
          Receive Early Access to Releases
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-md mx-auto">
          Subscribe for private drop notifications, seasonal styling notes, and private archive sales.
        </p>

        <form onSubmit={handleNewsletterSubmit} className="pt-3 flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
          <input
            type="email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition min-h-[48px]"
          />
          <button
            type="submit"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] text-white text-xs uppercase tracking-wider font-bold px-6 py-3.5 rounded-xl transition shadow-xs min-h-[48px]"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
