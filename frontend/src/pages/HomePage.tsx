import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard, { getCategoryTheme } from '../components/ProductCard';
import Loader from '../components/Loader';
import { productApi, categoryApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Sparkles, ArrowRight, ShieldCheck, Feather, Truck, RefreshCw } from 'lucide-react';
import type { Product, Category } from '../types';

// Fallback editorial images for hero carousel
const editorialImages = [
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [heroIdx, setHeroIdx] = useState(0);
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

  // Build hero carousel images: product images first, then editorial fallbacks
  const heroImages = useMemo(() => {
    const productImgs = featuredProducts
      .filter((p) => p.image_url)
      .map((p) => p.image_url!)
      .slice(0, 5);
    if (productImgs.length >= 3) return productImgs;
    return [...productImgs, ...editorialImages].slice(0, 5);
  }, [featuredProducts]);

  // Auto-advance hero carousel
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Thank you for subscribing to our seasonal updates.', 'success');
    setNewsletterEmail('');
  };

  if (loading) return <Loader message="Curating collection..." />;

  return (
    <div className="space-y-12 sm:space-y-20 overflow-hidden">
      {/* 1. Editorial Hero Section with Floating Micro-Badges */}
      <section className="relative bg-[var(--color-surface-subtle)] border-b border-stone-200/90 overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-7">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] sm:text-xs uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>Autumn/Winter '26 Edition</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl text-stone-950 font-extrabold tracking-tight leading-[1.12]">
                Refined Silhouettes, <br />
                <span className="text-[var(--color-accent)] font-bold">Timeless Comfort</span>
              </h1>

              <p className="text-xs sm:text-base text-stone-600 font-normal leading-relaxed max-w-xl">
                Explore our curated ready-to-wear collection crafted from 100% pure French Flax linen, compact Egyptian cotton, and raw selvedge denim—tailored for effortless everyday luxury.
              </p>

              {/* Floating Quality Stickers */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-xs text-[11px] font-bold text-stone-800"
                >
                  <Feather className="w-3.5 h-3.5 text-amber-600" />
                  <span>100% Breathable Linen</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-xs text-[11px] font-bold text-stone-800"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reinforced Seam Durability</span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 1 }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-xs text-[11px] font-bold text-stone-800"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Handcrafted Tailoring</span>
                </motion.div>
              </div>

              {/* Hero Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/shop"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] text-white text-xs uppercase tracking-wider font-extrabold px-7 py-4 rounded-xl shadow-md text-center transition min-h-[48px] flex items-center justify-center space-x-2"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="bg-white hover:bg-stone-50 active:bg-stone-100 text-stone-900 border border-stone-300 text-xs uppercase tracking-wider font-bold px-7 py-4 rounded-xl shadow-2xs text-center transition min-h-[48px] flex items-center justify-center"
                >
                  View Catalog
                </Link>
              </div>
            </div>

            {/* Right Hero Image Carousel */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 bg-stone-100">
                {/* Crossfading Image Carousel */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={heroIdx}
                    src={heroImages[heroIdx]}
                    alt={`Garments Atelier Editorial ${heroIdx + 1}`}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-[1]" />

                {/* Carousel Dot Indicators */}
                <div className="absolute top-4 right-4 z-[2] flex items-center gap-1.5">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      className={`rounded-full transition-all ${
                        i === heroIdx
                          ? 'w-5 h-1.5 bg-white'
                          : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Show image ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Floating Micro Badge on Image */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-xl flex items-center justify-between z-[2]"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] block">
                      Featured Drop
                    </span>
                    <h4 className="text-sm font-extrabold text-stone-950">
                      Selvedge Raw Denim Chore Jacket
                    </h4>
                    <p className="text-xs text-stone-500 font-semibold mt-0.5">
                      Rs. 6,850 &bull; Ready to Ship
                    </p>
                  </div>
                  <Link
                    to="/shop"
                    className="p-2.5 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
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
                  className="group bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:min-h-[160px] hover:border-stone-400 shadow-xs hover:shadow-md active:bg-stone-50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold ${theme.text} ${theme.bg} border ${theme.border} px-2 py-0.5 rounded-md`}>
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
                    <span>Explore Department</span>
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <Feather className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                Pure Natural Fabrics
              </h3>
              <p className="text-xs text-stone-500 font-normal leading-relaxed">
                100% fine cottons, French flax linens, and breathable natural blends.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
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
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
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
        <div className="bg-[var(--color-primary)] text-white p-7 sm:p-12 lg:p-16 rounded-3xl grid md:grid-cols-2 gap-6 sm:gap-8 items-center shadow-xl">
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

      {/* 6. Minimalist Newsletter */}
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
