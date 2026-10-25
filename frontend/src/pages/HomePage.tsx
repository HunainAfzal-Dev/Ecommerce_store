import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard, { getCategoryTheme } from '../components/ProductCard';
import Loader from '../components/Loader';
import { productApi, categoryApi } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { loginPath } from '../utils/safeRedirect';
import {
  Sparkles, ArrowRight, ShieldCheck, Feather, Truck, RefreshCw,
  ChevronLeft, ChevronRight, ShoppingBag as BagIcon
} from 'lucide-react';
import type { Product, Category } from '../types';
import Seo from '../components/Seo';

// Fallback editorial images used in the right-column desktop hero
const editorialImages = [
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
];

/* ─────────────────────────────────────────────────────────────────
   Compact Product Card — used ONLY inside the carousel track.
   Slightly narrower than the full grid ProductCard to let 1.5–4
   cards be visible at once depending on viewport width.
───────────────────────────────────────────── */
function CarouselProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const theme = getCategoryTheme(product.categories?.name, index);
  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 3;
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAddToBag = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!isAuthenticated) {
      showToast('Please sign in to add garments to your bag, then continue to checkout.', 'info');
      navigate(loginPath(`/product/${product.id}`));
      return;
    }
    try {
      await addToCart(product.id, 1);
      showToast(`"${product.name}" added to your bag.`, 'success');
    } catch {
      showToast('Could not add item. Please try again.', 'error');
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      /* clamp keeps cards at ~160 px on tiny phones, grows to 210 px on
         larger phones, and the container's fixed column approach takes
         over from md upward via the track's flex layout. */
      className="group flex-shrink-0 flex flex-col bg-white border border-stone-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
      style={{ scrollSnapAlign: 'start', width: 'clamp(158px, 60vw, 210px)' }}
    >
      {/* ── Thumbnail ── */}
      <div className="relative aspect-[3/4] bg-[#f7f5f1] overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={`${product.name}${product.categories?.name ? ` — ${product.categories.name}` : ''} garment`}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-10 h-10 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        )}

        {/* Category badge — top left */}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider
            ${theme.text} ${theme.bg} border ${theme.border} px-2 py-0.5 rounded-md shadow-xs`}
        >
          <span className={`w-1 h-1 rounded-full ${theme.dot}`} />
          {product.categories?.name || 'Garment'}
        </span>

        {/* Stock badge — top right */}
        <span
          className={`absolute top-2 right-2 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md shadow-xs ${isOutOfStock
              ? 'bg-red-50 text-red-600 border border-red-200'
              : isLowStock
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
        >
          {isOutOfStock ? 'Sold Out' : isLowStock ? `${product.stock_quantity} left` : 'In Stock'}
        </span>

        {/* Add-to-bag — revealed on hover (desktop) */}
        <button
          onClick={handleAddToBag}
          disabled={isOutOfStock}
          className={`absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-md
            opacity-0 group-hover:opacity-100 translate-y-1.5 group-hover:translate-y-0
            transition-all duration-200 ease-out hidden sm:flex
            ${isOutOfStock
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] active:scale-95'
            }`}
          aria-label="Add to bag"
          title={isOutOfStock ? 'Sold out' : 'Add to bag'}
        >
          <BagIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Info row ── */}
      <div className="p-2.5 flex flex-col flex-1 justify-between">
        <p
          className={`text-[11px] sm:text-xs font-bold text-stone-900 leading-snug line-clamp-2 ${theme.hoverText} transition-colors`}
        >
          {product.name}
        </p>

        <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-stone-100">
          <span className="text-xs sm:text-sm font-extrabold text-stone-950 tracking-tight">
            Rs.&nbsp;{product.price.toLocaleString()}
          </span>

          {/* Always-visible bag button on mobile (no hover needed) */}
          <button
            onClick={handleAddToBag}
            disabled={isOutOfStock}
            className={`sm:hidden w-7 h-7 rounded-full flex items-center justify-center shadow-xs active:scale-95 transition-transform
              ${isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-[var(--color-primary)] text-white'
              }`}
            aria-label="Add to bag"
          >
            <BagIcon className="w-3 h-3" />
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Multi-Card Product Carousel
   ─ Mobile  : ~1.5 cards visible (scroll-snap mandatory)
   ─ Tablet  : ~2.5 cards
   ─ Desktop : ~4 cards
   ─ Left / Right arrow buttons appear when scroll is possible
   ─ Smooth CSS scroll-snap + native touch/swipe
───────────────────────────────────────────── */
function ProductCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    window.addEventListener('resize', syncArrows);
    return () => {
      el.removeEventListener('scroll', syncArrows);
      window.removeEventListener('resize', syncArrows);
    };
  }, [syncArrows, products]);

  const scrollByCard = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector('[style*="scroll-snap-align"]') as HTMLElement | null;
    const gap = 12; // matches gap-3 (12px)
    const step = firstCard ? firstCard.offsetWidth + gap : 190;
    el.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-700">
            Trending Now
          </span>
        </div>
        <Link
          to="/shop"
          className="text-xs uppercase tracking-wider font-bold text-stone-700 hover:text-stone-950 transition flex items-center gap-1 group"
        >
          <span>View All</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* ── Left Arrow ── */}
        <AnimatePresence>
          {canLeft && (
            <motion.button
              key="carousel-left"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => scrollByCard('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10
                w-10 h-10 rounded-full bg-white border border-stone-200 shadow-lg
                items-center justify-center text-stone-700 hover:text-stone-950
                hover:shadow-xl transition-all duration-200 active:scale-90
                hidden sm:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Right Arrow ── */}
        <AnimatePresence>
          {canRight && (
            <motion.button
              key="carousel-right"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => scrollByCard('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10
                w-10 h-10 rounded-full bg-white border border-stone-200 shadow-lg
                items-center justify-center text-stone-700 hover:text-stone-950
                hover:shadow-xl transition-all duration-200 active:scale-90
                hidden sm:flex"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Scrollable track ── */}
        <div
          ref={trackRef}
          className="flex gap-3 overflow-x-auto pb-2 carousel-track"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',        /* Firefox */
            msOverflowStyle: 'none',       /* IE 11 */
          }}
        >
          {products.map((p, i) => (
            <CarouselProductCard key={p.id} product={p} index={i} />
          ))}
          {/* Trailing spacer so last card isn't edge-flush */}
          <div className="flex-shrink-0 w-1" aria-hidden="true" />
        </div>

        {/* Edge-fade masks so cards fade out smoothly at each side */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8
          bg-gradient-to-r from-[var(--color-background)] to-transparent z-[1]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8
          bg-gradient-to-l from-[var(--color-background)] to-transparent z-[1]" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Main HomePage
───────────────────────────────────────────── */
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
          categoryApi.getAll(),
        ]);
        setFeaturedProducts(productsRes.data.data.products || []);
        setCategories(categoriesRes.data.data.categories || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build hero image list: real product images first, then editorial fallbacks
  const heroImages = useMemo(() => {
    const productImgs = featuredProducts
      .filter((p) => p.image_url)
      .map((p) => p.image_url!)
      .slice(0, 5);
    if (productImgs.length >= 3) return productImgs;
    return [...productImgs, ...editorialImages].slice(0, 5);
  }, [featuredProducts]);

  // Auto-advance the right-column desktop hero image
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => setHeroIdx((p) => (p + 1) % heroImages.length), 4000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast('Thank you for subscribing to our seasonal updates.', 'success');
    setNewsletterEmail('');
  };

  if (loading) return <Loader message="Curating collection..." />;

  return (
    <div className="space-y-10 sm:space-y-16 overflow-hidden pb-4">
      <Seo
        title="Garments Store — Contemporary Minimal Apparel"
        description="Discover curated contemporary garments crafted with premium fabrics and modern silhouettes. Free delivery over Rs. 5,000. Cash on delivery nationwide."
      />

      {/* ① Editorial Hero */}
      <section className="relative bg-[var(--color-surface-subtle)] border-b border-stone-200/90 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left copy */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] sm:text-xs uppercase tracking-widest font-extrabold px-3 py-1.5 rounded-full shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Autumn / Winter '26 Edition</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl text-stone-950 font-extrabold tracking-tight leading-[1.12]">
                Refined Silhouettes,{' '}
                <br />
                <span className="text-[var(--color-accent)] font-bold">Timeless Comfort</span>
              </h1>

              <p className="text-xs sm:text-base text-stone-600 font-normal leading-relaxed max-w-xl">
                Explore our curated ready-to-wear collection crafted from 100% pure French Flax
                linen, compact Egyptian cotton, and raw selvedge denim—tailored for effortless
                everyday luxury.
              </p>

              {/* Floating quality stickers */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { icon: <Feather className="w-3.5 h-3.5 text-amber-600" />, label: '100% Breathable Linen', delay: 0 },
                  { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />, label: 'Reinforced Seam Durability', delay: 0.5 },
                  { icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />, label: 'Handcrafted Tailoring', delay: 1 },
                ].map(({ icon, label, delay }) => (
                  <motion.div
                    key={label}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4 + delay * 0.3, ease: 'easeInOut', delay }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 shadow-xs text-[11px] font-bold text-stone-800"
                  >
                    {icon}
                    <span>{label}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA buttons */}
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

            {/* Right hero image — desktop only */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 bg-stone-100">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-[1]" />

                {/* Dot nav */}
                <div className="absolute top-4 right-4 z-[2] flex items-center gap-1.5">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setHeroIdx(i)}
                      className={`rounded-full transition-all ${i === heroIdx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                      aria-label={`Show image ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Floating product pill */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/80 shadow-xl flex items-center justify-between z-[2]"
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-accent)] block">
                      Featured Drop
                    </span>
                    <h4 className="text-sm font-extrabold text-stone-950">Selvedge Raw Denim Chore Jacket</h4>
                    <p className="text-xs text-stone-500 font-semibold mt-0.5">Rs. 6,850 · Ready to Ship</p>
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

      {/* ② Multi-Card Product Carousel (replaces editorial image slider) */}
      <ProductCarousel products={featuredProducts} />

      {/* ③ Featured Arrivals grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 pb-3 border-b border-stone-200 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Latest Drop</span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {featuredProducts.slice(0, 8).map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-xl shadow-xs">
            <p className="text-xs text-stone-500">No garments available yet. Check back soon.</p>
          </div>
        )}
      </section>

      {/* ④ Shop by Category */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 pb-3 border-b border-stone-200 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-purple-700">Departments</span>
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {categories.slice(0, 8).map((category, idx) => {
              const theme = getCategoryTheme(category.name, idx);
              return (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="group bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[150px] hover:border-stone-400 shadow-xs hover:shadow-md active:bg-stone-50 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold ${theme.text} ${theme.bg} border ${theme.border} px-2 py-0.5 rounded-md`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
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

      {/* ⑤ Brand Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-8 shadow-xs">
          {[
            { icon: <Feather className="w-5 h-5" />, color: 'blue', title: 'Pure Natural Fabrics', desc: '100% fine cottons, French flax linens, and breathable natural blends.' },
            { icon: <Sparkles className="w-5 h-5" />, color: 'purple', title: 'Artisanal Tailoring', desc: 'Meticulous cuts designed for drape, silhouette, and longevity.' },
            { icon: <Truck className="w-5 h-5" />, color: 'emerald', title: 'Express Shipping', desc: 'Complimentary nationwide delivery on orders over Rs. 5,000.' },
            { icon: <RefreshCw className="w-5 h-5" />, color: 'amber', title: 'Doorstep Exchanges', desc: 'Hassle-free 7-day doorstep size replacement.' },
          ].map(({ icon, color, title, desc }) => (
            <div key={title} className="flex items-start gap-3.5 p-2">
              <div className={`w-10 h-10 rounded-2xl bg-${color}-50 text-${color}-600 border border-${color}-200 flex items-center justify-center shrink-0`}>
                {icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">{title}</h3>
                <p className="text-xs text-stone-500 font-normal leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⑥ Brand Ethos Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[var(--color-primary)] text-white p-7 sm:p-12 lg:p-16 rounded-3xl grid md:grid-cols-2 gap-6 sm:gap-8 items-center shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
              <span className="text-xs uppercase tracking-widest text-[var(--color-accent-border)] font-bold">The Atelier Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Designed for ease. <br />
              <span className="text-[var(--color-accent-border)] font-medium">Tailored for perpetuity.</span>
            </h2>
          </div>
          <div className="space-y-4 text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
            <p>
              We believe in wardrobe essentials that transcend fleeting trends. Each garment is drafted
              with thoughtful proportion, durable seams, and rich textural fabrics that grow softer with every wear.
            </p>
            <Link
              to="/shop"
              className="inline-block text-xs uppercase tracking-wider font-bold text-white border-b-2 border-[var(--color-accent)] pb-1 hover:text-[var(--color-accent-border)] transition"
            >
              Discover the Craft &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ⑦ Newsletter */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-blue-600 font-bold">Stay Connected</span>
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
