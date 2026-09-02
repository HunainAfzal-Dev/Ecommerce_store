import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp, Heart, Ruler, Globe, Clock, ShoppingBag, X, Eye, ChevronRight
} from 'lucide-react';

/* ================================================================
   SHARED TYPES & LOCAL STORAGE HELPERS
   ================================================================ */

export interface WidgetItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
}

const RECENTLY_VIEWED_KEY = 'garments_recently_viewed';
const WISHLIST_KEY = 'garments_wishlist';

// --- Recently Viewed ---
export function addToRecentlyViewed(item: WidgetItem) {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let items: WidgetItem[] = stored ? JSON.parse(stored) : [];
    items = items.filter((i) => i.id !== item.id);
    items.unshift(item);
    items = items.slice(0, 8);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('recently-viewed-updated'));
  } catch { /* noop */ }
}

function getRecentlyViewed(): WidgetItem[] {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// --- Wishlist ---
export function getWishlist(): WidgetItem[] {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(item: WidgetItem): boolean {
  const items = getWishlist();
  const exists = items.some((i) => i.id === item.id);
  let next: WidgetItem[];
  if (exists) {
    next = items.filter((i) => i.id !== item.id);
  } else {
    next = [item, ...items].slice(0, 20);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event('wishlist-updated'));
  return !exists; // returns new "is wishlisted" state
}

export function removeFromWishlist(id: string) {
  const items = getWishlist().filter((i) => i.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('wishlist-updated'));
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some((i) => i.id === id);
}

/* ================================================================
   1. SOCIAL PROOF TOAST  (bottom-left, auto-cycling)
   ================================================================ */

const socialProofData = [
  { name: 'Ayesha', city: 'Lahore', product: 'Premium Linen Kurta' },
  { name: 'Usman', city: 'Karachi', product: 'Raw Selvedge Chore Jacket' },
  { name: 'Sara', city: 'Islamabad', product: 'French Flax Wide-Leg Trousers' },
  { name: 'Ahmed', city: 'Faisalabad', product: 'Giza Cotton Henley Shirt' },
  { name: 'Zainab', city: 'Rawalpindi', product: 'Handwoven Silk Shawl' },
  { name: 'Ali', city: 'Multan', product: 'Organic Cotton Polo' },
  { name: 'Fatima', city: 'Peshawar', product: 'Relaxed Fit Chinos' },
  { name: 'Hassan', city: 'Sialkot', product: 'French Terry Hoodie' },
];

function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const showFirst = setTimeout(() => setVisible(true), 6000);

    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % socialProofData.length);
        setVisible(true);
      }, 600);
    }, 9000);

    return () => {
      clearTimeout(showFirst);
      clearInterval(cycle);
    };
  }, []);

  const item = socialProofData[currentIdx];
  const mins = 2 + ((currentIdx * 3) % 11);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -40, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="fixed bottom-6 left-4 z-30 hidden sm:flex max-w-[280px] bg-white border border-stone-200/90 rounded-2xl shadow-xl p-3 items-start gap-2.5 cursor-pointer group hover:shadow-2xl transition-shadow"
          onClick={() => setVisible(false)}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-stone-900 leading-snug">
              {item.name} from {item.city}
            </p>
            <p className="text-[10px] text-stone-500 truncate">
              ordered <span className="font-semibold text-stone-700">"{item.product}"</span>
            </p>
            <p className="text-[9px] text-stone-400 mt-0.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              {mins} min ago • Verified
            </p>
          </div>
          <button className="text-stone-300 group-hover:text-stone-500 transition shrink-0">
            <X className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   2. BACK TO TOP  (bottom-right, above AI pill, with scroll ring)
   ================================================================ */

function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 400);
      setProgress(docH > 0 ? Math.min(scrollTop / docH, 1) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const circumference = 2 * Math.PI * 18;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-[5.5rem] right-6 z-35 w-10 h-10 bg-white border border-stone-200 rounded-full shadow-lg flex items-center justify-center text-stone-600 hover:text-stone-950 hover:shadow-xl transition-all group"
          aria-label="Back to top"
        >
          <svg className="absolute inset-0 w-10 h-10 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#e7e5e4" strokeWidth="2" />
            <circle
              cx="20" cy="20" r="18" fill="none"
              stroke="#9c5b3c" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-200"
            />
          </svg>
          <ArrowUp className="w-3.5 h-3.5 relative z-10 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ================================================================
   3. PROMO / DISCOUNT RIBBON  (left edge, vertical)
   ================================================================ */

function PromoRibbon() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ x: -60 }}
      animate={{ x: 0 }}
      transition={{ delay: 2, type: 'spring', damping: 18, stiffness: 180 }}
      className="fixed left-0 top-[38%] z-30 hidden md:block"
    >
      <button
        onClick={() => setDismissed(true)}
        className="relative bg-gradient-to-b from-[var(--color-accent)] to-[#7a4630] text-white py-4 px-2 rounded-r-xl shadow-lg hover:brightness-110 transition-all group"
        style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}
      >
        <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] whitespace-nowrap">
          🏷 FLAT 15% OFF — ATELIER15
        </span>
      </button>
    </motion.div>
  );
}

/* ================================================================
   4. RIGHT-SIDE TOOLBAR
   Contains: Recently Viewed, Wishlist, Size Finder, Currency
   ================================================================ */

// --- Size Finder Sub-Panel ---
function SizeFinderPanel() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const h = parseInt(height);
    const w = parseInt(weight);
    if (isNaN(h) || isNaN(w)) return;

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    let idx: number;
    if (w < 55) idx = 0;
    else if (w < 65) idx = 1;
    else if (w < 75) idx = 2;
    else if (w < 88) idx = 3;
    else if (w < 100) idx = 4;
    else idx = 5;

    // Height adjustment
    if (h > 185 && idx < 5) idx++;
    if (h < 165 && idx > 0) idx--;

    setResult(sizes[idx]);
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Quick Size Finder</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            className="w-full mt-1 px-2.5 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            className="w-full mt-1 px-2.5 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400"
          />
        </div>
      </div>
      <button
        onClick={calculate}
        className="w-full py-2 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[var(--color-primary-hover)] transition active:scale-[0.98]"
      >
        Find My Size
      </button>
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center"
        >
          <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Recommended</p>
          <p className="text-2xl font-extrabold text-emerald-800 tracking-tight">{result}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Based on {height}cm / {weight}kg</p>
        </motion.div>
      )}
    </div>
  );
}

// --- Currency Panel ---
function CurrencyPanel() {
  const [currency, setCurrency] = useState<'PKR' | 'USD' | 'GBP'>('PKR');
  const rates: Record<string, { symbol: string; rate: number; label: string }> = {
    PKR: { symbol: 'Rs.', rate: 1, label: 'Pakistani Rupee' },
    USD: { symbol: '$', rate: 0.0036, label: 'US Dollar' },
    GBP: { symbol: '£', rate: 0.0028, label: 'British Pound' },
  };

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Currency Guide</h4>
      <div className="space-y-1.5">
        {Object.entries(rates).map(([code, { label }]) => (
          <button
            key={code}
            onClick={() => setCurrency(code as 'PKR' | 'USD' | 'GBP')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
              currency === code
                ? 'bg-[var(--color-primary)] text-white font-bold'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>{code}</span>
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </div>
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center">
        <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Example Conversion</p>
        <p className="text-sm font-extrabold text-stone-900 mt-0.5">
          Rs. 5,000 ≈ {rates[currency].symbol} {(5000 * rates[currency].rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </p>
        <p className="text-[9px] text-stone-400 mt-1">Approximate rate • Checkout always in PKR</p>
      </div>
    </div>
  );
}

// --- Main Right-Side Toolbar ---
function RightSideToolbar() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<WidgetItem[]>(getRecentlyViewed());
  const [wishlist, setWishlist] = useState<WidgetItem[]>(getWishlist());
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Listen for storage events to refresh data
  useEffect(() => {
    const refreshRecent = () => setRecentlyViewed(getRecentlyViewed());
    const refreshWishlist = () => setWishlist(getWishlist());
    window.addEventListener('recently-viewed-updated', refreshRecent);
    window.addEventListener('wishlist-updated', refreshWishlist);
    return () => {
      window.removeEventListener('recently-viewed-updated', refreshRecent);
      window.removeEventListener('wishlist-updated', refreshWishlist);
    };
  }, []);

  // Close panel on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    if (activePanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePanel]);

  const toggle = useCallback((panel: string) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  const buttons = [
    { id: 'recent', icon: Clock, label: 'Recently Viewed', count: recentlyViewed.length, color: 'text-blue-600' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', count: wishlist.length, color: 'text-rose-500' },
    { id: 'size', icon: Ruler, label: 'Size Finder', count: 0, color: 'text-amber-600' },
    { id: 'currency', icon: Globe, label: 'Currency', count: 0, color: 'text-indigo-600' },
  ];

  return (
    <div ref={toolbarRef} className="fixed right-0 top-1/2 -translate-y-1/2 z-30 hidden md:flex items-start">
      {/* Expandable Panel */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mr-2 w-64 bg-white border border-stone-200/90 rounded-2xl shadow-2xl p-4 max-h-[420px] overflow-y-auto"
          >
            {/* Recently Viewed */}
            {activePanel === 'recent' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> Recently Viewed
                </h4>
                {recentlyViewed.length === 0 ? (
                  <p className="text-[11px] text-stone-400 py-6 text-center">No items viewed yet. Browse our collection!</p>
                ) : (
                  <div className="space-y-1.5">
                    {recentlyViewed.slice(0, 6).map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => setActivePanel(null)}
                        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-stone-50 transition group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          {item.image_url ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <Eye className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-stone-800 truncate group-hover:text-[var(--color-accent)] transition">{item.name}</p>
                          <p className="text-[10px] text-stone-500">Rs. {item.price.toLocaleString()}</p>
                        </div>
                        <ChevronRight className="w-3 h-3 text-stone-300 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist */}
            {activePanel === 'wishlist' && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> My Wishlist
                </h4>
                {wishlist.length === 0 ? (
                  <p className="text-[11px] text-stone-400 py-6 text-center">Your wishlist is empty. Tap ❤️ on any product to save it!</p>
                ) : (
                  <div className="space-y-1.5">
                    {wishlist.map((item) => (
                      <div key={item.id} className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-stone-50 transition group">
                        <Link to={`/product/${item.id}`} onClick={() => setActivePanel(null)} className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            {item.image_url ? (
                              <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <Heart className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-stone-800 truncate group-hover:text-[var(--color-accent)] transition">{item.name}</p>
                            <p className="text-[10px] text-stone-500">Rs. {item.price.toLocaleString()}</p>
                          </div>
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="p-1 text-stone-300 hover:text-rose-500 transition shrink-0"
                          title="Remove from wishlist"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Size Finder */}
            {activePanel === 'size' && <SizeFinderPanel />}

            {/* Currency */}
            {activePanel === 'currency' && <CurrencyPanel />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon Buttons Column */}
      <div className="flex flex-col gap-1.5">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activePanel === btn.id;
          return (
            <button
              key={btn.id}
              onClick={() => toggle(btn.id)}
              className={`relative w-10 h-10 rounded-l-xl border border-r-0 flex items-center justify-center transition-all shadow-md ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white border-stone-700 shadow-lg'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
              title={btn.label}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
              {btn.count > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[var(--color-accent)] text-white text-[8px] font-extrabold flex items-center justify-center shadow-xs">
                  {btn.count > 9 ? '9+' : btn.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   5. LIVE VIEWER COUNT  (for product detail pages)
   ================================================================ */

export function LiveViewerBadge() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 18) + 5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(3, Math.min(35, prev + delta));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] text-stone-600 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1">
      <Eye className="w-3 h-3 text-stone-500" />
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="font-semibold">{count} people</span>
      <span className="text-stone-400">viewing now</span>
    </div>
  );
}

/* ================================================================
   MAIN EXPORT: ALL FLOATING WIDGETS
   ================================================================ */

export default function FloatingWidgets() {
  return (
    <>
      <SocialProofToast />
      <BackToTopButton />
      <PromoRibbon />
      <RightSideToolbar />
    </>
  );
}
