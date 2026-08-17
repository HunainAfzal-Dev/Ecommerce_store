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
    showToast('Thank you for subscribing to our seasonal updates.', 'success');
    setNewsletterEmail('');
  };

  if (loading) return <Loader message="Curating collection..." />;

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* Editorial Hero Section */}
      <section className="relative bg-[var(--color-surface-subtle)] border-b border-stone-200/90 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent-border)] text-xs uppercase tracking-widest font-bold px-3 py-1.5 rounded-md">
              <span>New Season Edition</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-stone-950 font-extrabold tracking-tight leading-[1.15]">
              Refined Silhouettes, <br />
              <span className="text-[var(--color-accent)] font-semibold">Timeless Comfort</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed max-w-lg">
              Explore our curated garments crafted from pure breathable fabrics, tailored for effortless daily wear and modern understated luxury.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                to="/shop"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-7 py-3.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
              >
                Shop Collection
              </Link>
              <Link
                to="/shop"
                className="bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 text-xs uppercase tracking-wider font-bold px-7 py-3.5 rounded-lg shadow-2xs transition-all duration-200"
              >
                View Catalog &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-y border-stone-200/80 py-8">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
              Pure Natural Fabrics
            </h3>
            <p className="text-xs text-stone-500 font-normal leading-relaxed">
              100% fine cottons, rich linens, and breathable blends.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
              Artisanal Tailoring
            </h3>
            <p className="text-xs text-stone-500 font-normal leading-relaxed">
              Meticulous cuts designed for drape, fit, and longevity.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
              Express Shipping
            </h3>
            <p className="text-xs text-stone-500 font-normal leading-relaxed">
              Complimentary delivery nationwide on orders over Rs. 5,000.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
              Doorstep Exchanges
            </h3>
            <p className="text-xs text-stone-500 font-normal leading-relaxed">
              Hassle-free 7-day doorstep size replacement.
            </p>
          </div>
        </div>
      </section>

      {/* Shop by Category Showcase */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-stone-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                Departments
              </p>
              <h2 className="text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight mt-0.5">
                Shop by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition mt-2 sm:mt-0"
            >
              Explore All Categories &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.id}`}
                className="group bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 flex flex-col justify-between min-h-[140px] hover:border-[var(--color-accent)] hover:shadow-xs transition-all duration-300"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                    Department
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-950 group-hover:text-[var(--color-accent)] transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-stone-500 line-clamp-2 font-normal">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                  <span>Browse</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured / Latest Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-stone-200">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
              Latest Drop
            </p>
            <h2 className="text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight mt-0.5">
              Featured Arrivals
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition mt-2 sm:mt-0"
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
          <div className="text-center py-16 bg-white border border-stone-200 rounded-xl">
            <p className="text-xs text-stone-500 font-normal">
              No garments available in this collection yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {/* Brand Ethos / Story Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--color-primary)] text-white p-8 sm:p-14 lg:p-16 rounded-2xl grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-[var(--color-accent-border)] font-bold">
              The Atelier Philosophy
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
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

      {/* Minimalist Newsletter */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 text-center space-y-3">
        <p className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-bold">
          Stay Connected
        </p>
        <h2 className="text-2xl sm:text-3xl text-stone-950 font-bold tracking-tight">
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
            className="flex-1 px-4 py-3 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
          />
          <button
            type="submit"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-6 py-3 rounded-lg transition shadow-xs"
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
