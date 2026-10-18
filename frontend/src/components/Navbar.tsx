import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import {
  ShoppingBag, Search, Menu, X, Shield, ArrowRight,
  Clock, Heart, Ruler, Globe, ChevronDown, Eye
} from 'lucide-react';
import {
  getRecentlyViewedCount, getWishlistCount,
  getRecentlyViewed, getWishlist, removeFromWishlist
} from './FloatingWidgets';
import type { WidgetItem } from './FloatingWidgets';

const tickerAnnouncements = [
  "⚡ NEW SEASON EDITION LIVE",
  "COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER RS. 5,000",
  "100% PURE NATURAL FABRICS (LINEN, COTTON, RAW SILK)",
  "HASSLE-FREE 7-DAY DOORSTEP SIZE EXCHANGES",
  "CASH ON DELIVERY (COD) AVAILABLE NATIONWIDE"
];

/* ──────────────────────────────────────────────────────────────
   Mobile Widget Tools (embedded inside the sidebar drawer)
   ────────────────────────────────────────────────────────────── */
function MobileWidgetTools({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'recent' | 'wishlist' | 'size' | 'currency'>('recent');
  const [recentItems, setRecentItems] = useState<WidgetItem[]>(getRecentlyViewed());
  const [wishItems, setWishItems] = useState<WidgetItem[]>(getWishlist());
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [sizeResult, setSizeResult] = useState<string | null>(null);
  const [currency, setCurrency] = useState<'PKR' | 'USD' | 'GBP'>('PKR');

  useEffect(() => {
    const rr = () => setRecentItems(getRecentlyViewed());
    const rw = () => setWishItems(getWishlist());
    window.addEventListener('recently-viewed-updated', rr);
    window.addEventListener('wishlist-updated', rw);
    return () => {
      window.removeEventListener('recently-viewed-updated', rr);
      window.removeEventListener('wishlist-updated', rw);
    };
  }, []);

  const calcSize = () => {
    const h = parseInt(height);
    const w = parseInt(weight);
    if (isNaN(h) || isNaN(w)) return;
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    let idx = w < 55 ? 0 : w < 65 ? 1 : w < 75 ? 2 : w < 88 ? 3 : w < 100 ? 4 : 5;
    if (h > 185 && idx < 5) idx++;
    if (h < 165 && idx > 0) idx--;
    setSizeResult(sizes[idx]);
  };

  const rates: Record<string, { symbol: string; rate: number; label: string }> = {
    PKR: { symbol: 'Rs.', rate: 1, label: 'Pakistani Rupee' },
    USD: { symbol: '$', rate: 0.0036, label: 'US Dollar' },
    GBP: { symbol: '£', rate: 0.0028, label: 'British Pound' },
  };

  const tabs = [
    { id: 'recent' as const, icon: Clock, label: 'History', count: recentItems.length },
    { id: 'wishlist' as const, icon: Heart, label: 'Wishlist', count: wishItems.length },
    { id: 'size' as const, icon: Ruler, label: 'Sizes', count: 0 },
    { id: 'currency' as const, icon: Globe, label: 'Currency', count: 0 },
  ];

  return (
    <div className="mt-2 mx-1 bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-stone-200">
        {tabs.map(({ id, icon: Icon, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[9px] font-bold uppercase tracking-wider transition relative ${
              activeTab === id ? 'text-[var(--color-accent)] bg-white' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            <span className="relative">
              <Icon className="w-4 h-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] text-white text-[7px] font-extrabold flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </span>
            {label}
            {activeTab === id && (
              <motion.div layoutId="mobile-widget-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="p-3">
        {/* Recently Viewed */}
        {activeTab === 'recent' && (
          <div className="space-y-1.5">
            {recentItems.length === 0 ? (
              <p className="text-[11px] text-stone-400 py-4 text-center">Browse the collection to see your history here.</p>
            ) : (
              recentItems.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  onClick={onClose}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white transition group"
                >
                  <div className="w-9 h-9 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    {item.image_url
                      ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-stone-300"><Eye className="w-3 h-3" /></div>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-stone-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-stone-500">Rs. {item.price.toLocaleString()}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-stone-300 shrink-0 -rotate-90" />
                </Link>
              ))
            )}
          </div>
        )}

        {/* Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-1.5">
            {wishItems.length === 0 ? (
              <p className="text-[11px] text-stone-400 py-4 text-center">Tap ❤️ on any product to save it here.</p>
            ) : (
              wishItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white transition">
                  <Link to={`/product/${item.id}`} onClick={onClose} className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                      {item.image_url
                        ? <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-stone-300"><Heart className="w-3 h-3" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-stone-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => { removeFromWishlist(item.id); setWishItems(getWishlist()); }}
                    className="p-1 text-stone-300 hover:text-rose-500 transition shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Size Finder */}
        {activeTab === 'size' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Height (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="175"
                  className="w-full mt-1 px-2.5 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 bg-white focus:outline-none focus:border-stone-400"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="70"
                  className="w-full mt-1 px-2.5 py-2 border border-stone-200 rounded-lg text-xs text-stone-900 bg-white focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>
            <button
              onClick={calcSize}
              className="w-full py-2 bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[var(--color-primary-hover)] transition active:scale-[0.98]"
            >
              Find My Size
            </button>
            {sizeResult && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Recommended</p>
                <p className="text-2xl font-extrabold text-emerald-800">{sizeResult}</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Based on {height}cm / {weight}kg</p>
              </motion.div>
            )}
          </div>
        )}

        {/* Currency Guide */}
        {activeTab === 'currency' && (
          <div className="space-y-2">
            {Object.entries(rates).map(([code, { label }]) => (
              <button
                key={code}
                onClick={() => setCurrency(code as 'PKR' | 'USD' | 'GBP')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  currency === code
                    ? 'bg-[var(--color-primary)] text-white font-bold'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <span>{code}</span>
                <span className="text-[10px]">{label}</span>
              </button>
            ))}
            <div className="bg-white border border-stone-200 rounded-xl p-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">Example</p>
              <p className="text-sm font-extrabold text-stone-900 mt-0.5">
                Rs. 5,000 ≈ {rates[currency].symbol} {(5000 * rates[currency].rate).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-[9px] text-stone-400 mt-1">Approx. rate • Checkout always in PKR</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Main Navbar Component
   ────────────────────────────────────────────────────────────── */
export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [widgetsOpen, setWidgetsOpen] = useState(false);
  const [recentCount, setRecentCount] = useState(getRecentlyViewedCount());
  const [wishCount, setWishCount] = useState(getWishlistCount());
  // Suppress unused-variable lints — counts used in UI via count badges in widget tools
  void recentCount; void wishCount;

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Sync widget counts from storage events
  useEffect(() => {
    const refreshRecent = () => setRecentCount(getRecentlyViewedCount());
    const refreshWish = () => setWishCount(getWishlistCount());
    window.addEventListener('recently-viewed-updated', refreshRecent);
    window.addEventListener('wishlist-updated', refreshWish);
    return () => {
      window.removeEventListener('recently-viewed-updated', refreshRecent);
      window.removeEventListener('wishlist-updated', refreshWish);
    };
  }, []);

  const handleLogout = () => {
    logout();
    showToast('You have been signed out successfully.', 'info');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    /* sticky wrapper — wraps BOTH the ticker AND the header so they scroll together then stick */
    <div className="sticky top-0 z-40">
      {/* 1. Animated Continuous Running Marquee Ticker */}
      <div className="bg-[var(--color-primary)] text-stone-200 py-1.5 border-b border-stone-800 select-none overflow-hidden relative">
        <div className="animate-marquee flex items-center space-x-10 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
          {[...tickerAnnouncements, ...tickerAnnouncements].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{item}</span>
              <span className="text-stone-600 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="bg-[var(--color-background)]/97 backdrop-blur-md border-b border-stone-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-18">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 flex items-center justify-center -ml-2 text-stone-900 hover:text-[var(--color-accent)] active:bg-stone-100 rounded-lg transition"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Wordmark */}
            <div className="flex-1 md:flex-none flex justify-center md:justify-start">
              <Link to="/" className="flex flex-col items-center md:items-start group">
                <span className="font-extrabold text-lg sm:text-2xl tracking-[0.14em] uppercase text-stone-950 group-hover:text-[var(--color-accent)] transition-colors">
                  Garments Store
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--color-accent)] -mt-1 hidden sm:block">
                  Atelier &bull; Ready-to-Wear
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-xs uppercase tracking-wider font-bold transition-colors relative py-1.5 ${
                  isActive('/') ? 'text-stone-950 font-extrabold' : 'text-stone-600 hover:text-[var(--color-accent)]'
                }`}
              >
                Home
                {isActive('/') && (
                  <motion.span
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full"
                  />
                )}
              </Link>

              <Link
                to="/shop"
                className={`text-xs uppercase tracking-wider font-bold transition-colors relative py-1.5 ${
                  isActive('/shop') ? 'text-stone-950 font-extrabold' : 'text-stone-600 hover:text-[var(--color-accent)]'
                }`}
              >
                Shop Collection
                {isActive('/shop') && (
                  <motion.span
                    layoutId="navbar-underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full"
                  />
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-xs uppercase tracking-wider font-bold transition-colors relative py-1.5 flex items-center space-x-1.5 ${
                    location.pathname.startsWith('/admin')
                      ? 'text-purple-700 font-extrabold'
                      : 'text-purple-600 hover:text-purple-800'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                  {location.pathname.startsWith('/admin') && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 rounded-full"
                    />
                  )}
                </Link>
              )}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1.5 sm:space-x-4">
              <Link
                to="/shop"
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-stone-800 hover:text-[var(--color-accent)] active:bg-stone-100 rounded-xl transition"
                aria-label="Search garments"
                title="Search collection"
              >
                <Search className="w-5 h-5 stroke-[1.7]" />
              </Link>

              <Link
                to="/cart"
                className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-stone-800 hover:text-[var(--color-accent)] active:bg-stone-100 rounded-xl transition"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.7]" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-1.5 right-1.5 bg-[var(--color-accent)] text-white text-[9px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center shadow-xs"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-stone-200">
                  <span className="text-xs font-bold text-stone-800">{user?.name?.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-wider font-bold text-stone-500 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-stone-200">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-wider font-bold text-stone-800 hover:text-[var(--color-accent)] px-2.5 py-1.5 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-xl transition shadow-xs active:scale-95"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Slide-Over Drawer Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
              >
                {/* Drawer Header — sticky */}
                <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-stone-100 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-base tracking-wider uppercase text-stone-950">
                        Garments Store
                      </span>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-[var(--color-accent)]">
                        Atelier Navigation
                      </span>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-lg"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                  {/* Navigation Links */}
                  <nav className="space-y-1">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3.5 px-3 rounded-xl text-sm uppercase tracking-wider font-bold transition ${
                        isActive('/') ? 'bg-stone-100 text-stone-950 font-extrabold' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>Home</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </Link>

                    <Link
                      to="/shop"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3.5 px-3 rounded-xl text-sm uppercase tracking-wider font-bold transition ${
                        isActive('/shop') ? 'bg-stone-100 text-stone-950 font-extrabold' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>Shop Collection</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3.5 px-3 rounded-xl text-sm uppercase tracking-wider font-bold transition ${
                        isActive('/cart') ? 'bg-stone-100 text-stone-950 font-extrabold' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>Shopping Bag ({cartCount})</span>
                      <ArrowRight className="w-4 h-4 text-stone-400" />
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3.5 px-3 rounded-xl text-sm uppercase tracking-wider font-bold transition ${
                          location.pathname.startsWith('/admin')
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'text-purple-700 hover:bg-purple-50'
                        }`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <Shield className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </span>
                        <ArrowRight className="w-4 h-4 text-purple-400" />
                      </Link>
                    )}
                  </nav>

                  {/* Divider */}
                  <div className="pt-2 pb-1">
                    <div className="h-px bg-stone-100" />
                  </div>

                  {/* ── Mobile Widgets Expandable Section ── */}
                  <div>
                    <button
                      onClick={() => setWidgetsOpen(!widgetsOpen)}
                      className="w-full flex items-center justify-between py-3 px-3 rounded-xl text-sm uppercase tracking-wider font-bold text-stone-600 hover:bg-stone-50 transition"
                    >
                      <span>Quick Tools</span>
                      <motion.span animate={{ rotate: widgetsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {widgetsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <MobileWidgetTools onClose={() => setMobileMenuOpen(false)} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Bottom Auth Section — sticky */}
                <div className="flex-shrink-0 px-4 pb-6 pt-4 border-t border-stone-100 space-y-3">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="bg-[var(--color-surface-subtle)] p-3.5 rounded-xl border border-stone-200/80">
                        <p className="text-xs text-stone-500 font-normal">Signed in as</p>
                        <p className="font-bold text-sm text-stone-950 truncate">{user?.name}</p>
                        <p className="text-xs text-stone-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full py-3.5 text-center text-xs uppercase tracking-wider font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-3.5 border border-stone-300 rounded-xl text-xs uppercase tracking-wider font-bold text-stone-900 bg-white shadow-2xs"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center py-3.5 bg-[var(--color-primary)] text-white rounded-xl text-xs uppercase tracking-wider font-bold shadow-xs"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
