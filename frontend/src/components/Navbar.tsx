import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

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
      {/* Top Announcement Bar */}
      <div className="bg-[var(--color-primary)] text-stone-300 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase py-2 px-3 text-center border-b border-stone-800 truncate">
        Complimentary express delivery on orders over Rs. 5,000
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-background)]/95 backdrop-blur-md border-b border-stone-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mobile Menu Button (min 44px touch target) */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 flex items-center justify-center -ml-2 text-stone-900 hover:text-[var(--color-accent)] active:bg-stone-100 rounded-lg transition"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>

            {/* Brand Logo / Wordmark */}
            <div className="flex-1 md:flex-none flex justify-center md:justify-start">
              <Link to="/" className="flex flex-col items-center md:items-start group">
                <span className="font-bold text-lg sm:text-2xl tracking-[0.12em] sm:tracking-[0.15em] uppercase text-stone-950 group-hover:text-[var(--color-accent)] transition-colors">
                  Garments Store
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-semibold text-[var(--color-accent)] -mt-1 hidden xs:block">
                  Atelier &bull; Ready-to-Wear
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-xs uppercase tracking-wider font-semibold transition-colors relative py-1.5 ${
                  isActive('/') ? 'text-stone-950 font-bold' : 'text-stone-600 hover:text-[var(--color-accent)]'
                }`}
              >
                Home
                {isActive('/') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full" />
                )}
              </Link>

              <Link
                to="/shop"
                className={`text-xs uppercase tracking-wider font-semibold transition-colors relative py-1.5 ${
                  isActive('/shop') ? 'text-stone-950 font-bold' : 'text-stone-600 hover:text-[var(--color-accent)]'
                }`}
              >
                Shop Collection
                {isActive('/shop') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full" />
                )}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-xs uppercase tracking-wider font-semibold transition-colors relative py-1.5 ${
                    location.pathname.startsWith('/admin')
                      ? 'text-stone-950 font-bold'
                      : 'text-stone-600 hover:text-[var(--color-accent)]'
                  }`}
                >
                  Admin Portal
                  {location.pathname.startsWith('/admin') && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full" />
                  )}
                </Link>
              )}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              {/* Search Shortcut (min 44px touch target) */}
              <Link
                to="/shop"
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-stone-800 hover:text-[var(--color-accent)] active:bg-stone-100 rounded-lg transition"
                aria-label="Search garments"
                title="Search collection"
              >
                <svg className="w-5 h-5 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </Link>

              {/* Shopping Bag / Cart (min 44px touch target) */}
              <Link
                to="/cart"
                className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-stone-800 hover:text-[var(--color-accent)] active:bg-stone-100 rounded-lg transition"
                aria-label="Shopping Cart"
              >
                <svg className="w-5 h-5 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[var(--color-accent)] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Desktop Account Dropdown / Actions */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-3 pl-3 border-l border-stone-200">
                  <span className="text-xs font-bold text-stone-700">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-wider font-bold text-stone-600 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2 pl-3 border-l border-stone-200">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-wider font-bold text-stone-800 hover:text-[var(--color-accent)] px-2 py-1.5 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-3.5 py-2 rounded-lg transition shadow-xs"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Slide-Over Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            />

            {/* Drawer Content */}
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-fade-in overflow-y-auto">
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-wider uppercase text-stone-950">
                      Garments Store
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-[var(--color-accent)]">
                      Atelier Navigation
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-lg"
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Navigation Links with large 48px touch targets */}
                <nav className="space-y-1">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3.5 px-3 rounded-lg text-sm uppercase tracking-wider font-bold transition ${
                      isActive('/') ? 'bg-stone-100 text-stone-950 font-extrabold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Home</span>
                    <span>&rarr;</span>
                  </Link>

                  <Link
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3.5 px-3 rounded-lg text-sm uppercase tracking-wider font-bold transition ${
                      isActive('/shop') ? 'bg-stone-100 text-stone-950 font-extrabold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Shop Collection</span>
                    <span>&rarr;</span>
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-3.5 px-3 rounded-lg text-sm uppercase tracking-wider font-bold transition ${
                      isActive('/cart') ? 'bg-stone-100 text-stone-950 font-extrabold' : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>Shopping Bag ({cartCount})</span>
                    <span>&rarr;</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-3.5 px-3 rounded-lg text-sm uppercase tracking-wider font-bold transition ${
                        location.pathname.startsWith('/admin')
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      <span>Admin Dashboard</span>
                      <span>&rarr;</span>
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
                      className="w-full py-3.5 text-center text-xs uppercase tracking-wider font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-3.5 border border-stone-300 rounded-lg text-xs uppercase tracking-wider font-bold text-stone-900 bg-white shadow-2xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-3.5 bg-[var(--color-primary)] text-white rounded-lg text-xs uppercase tracking-wider font-bold shadow-xs"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
