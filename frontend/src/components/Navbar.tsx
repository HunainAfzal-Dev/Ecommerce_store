import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, Search, Menu, X, Shield, ArrowRight } from 'lucide-react';

const tickerAnnouncements = [
  "⚡ NEW SEASON EDITION LIVE",
  "COMPLIMENTARY EXPRESS DELIVERY ON ORDERS OVER RS. 5,000",
  "100% PURE NATURAL FABRICS (LINEN, COTTON, RAW SILK)",
  "HASSLE-FREE 7-DAY DOORSTEP SIZE EXCHANGES",
  "CASH ON DELIVERY (COD) AVAILABLE NATIONWIDE"
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    showToast('You have been signed out successfully.', 'info');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 1. Animated Continuous Running Marquee Ticker */}
      <div className="bg-[var(--color-primary)] text-stone-200 py-2 border-b border-stone-800 select-none overflow-hidden relative z-40">
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
      <header className="sticky top-0 z-40 bg-[var(--color-background)]/95 backdrop-blur-md border-b border-stone-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
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
                <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-bold text-[var(--color-accent)] -mt-1 hidden xs:block">
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
              {/* Quick Search Trigger */}
              <Link
                to="/shop"
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-stone-800 hover:text-[var(--color-accent)] active:bg-stone-100 rounded-xl transition"
                aria-label="Search garments"
                title="Search collection"
              >
                <Search className="w-5 h-5 stroke-[1.7]" />
              </Link>

              {/* Shopping Bag with Animated Counter */}
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

              {/* Desktop Account Dropdown / Actions */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-stone-200">
                  <span className="text-xs font-bold text-stone-800">
                    {user?.name?.split(' ')[0]}
                  </span>
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
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto"
              >
                <div className="space-y-6">
                  {/* Header inside drawer */}
                  <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-lg tracking-wider uppercase text-stone-950">
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

                  {/* Navigation Links with large 48px touch targets */}
                  <nav className="space-y-1.5">
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
                </div>

                {/* Bottom Auth Section */}
                <div className="pt-6 border-t border-stone-200 space-y-3">
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
    </>
  );
}
