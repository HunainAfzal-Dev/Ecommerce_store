import { useState } from 'react';
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
      <div className="bg-stone-900 text-stone-300 text-[11px] font-medium tracking-widest uppercase py-2 px-4 text-center border-b border-stone-800">
        Complimentary express delivery on orders over Rs. 5,000 &bull; Sustainable Fashion
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-stone-900 hover:text-stone-600 transition"
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
                <span className="font-serif text-xl sm:text-2xl tracking-[0.2em] font-medium uppercase text-stone-950 group-hover:opacity-80 transition">
                  Garments Store
                </span>
                <span className="text-[9px] tracking-[0.3em] uppercase text-stone-500 -mt-1 hidden sm:block">
                  Atelier &bull; Ready-to-Wear
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-xs uppercase tracking-widest font-medium transition-colors relative py-1 ${
                  isActive('/') ? 'text-stone-950 font-semibold' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Home
                {isActive('/') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-950" />}
              </Link>

              <Link
                to="/shop"
                className={`text-xs uppercase tracking-widest font-medium transition-colors relative py-1 ${
                  isActive('/shop') ? 'text-stone-950 font-semibold' : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                Shop Collection
                {isActive('/shop') && <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-950" />}
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`text-xs uppercase tracking-widest font-medium transition-colors relative py-1 ${
                    location.pathname.startsWith('/admin')
                      ? 'text-stone-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  Admin Portal
                  {location.pathname.startsWith('/admin') && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-950" />
                  )}
                </Link>
              )}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Shortcut */}
              <Link
                to="/shop"
                className="p-2 text-stone-800 hover:text-stone-950 transition"
                aria-label="Search garments"
                title="Search collection"
              >
                <svg className="w-5 h-5 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </Link>

              {/* Shopping Bag / Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-stone-800 hover:text-stone-950 transition"
                aria-label="Shopping Cart"
              >
                <svg className="w-5 h-5 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-stone-900 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown / Actions */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 pl-2 border-l border-stone-200">
                  <span className="hidden lg:block text-xs font-medium text-stone-700">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs uppercase tracking-wider font-semibold text-stone-600 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 pl-2 border-l border-stone-200">
                  <Link
                    to="/login"
                    className="text-xs uppercase tracking-wider font-semibold text-stone-800 hover:text-stone-950 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block bg-stone-900 hover:bg-stone-800 text-white text-xs uppercase tracking-wider font-semibold px-3.5 py-2 transition"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-[#faf9f6] px-4 pt-3 pb-6 space-y-3 animate-fade-in">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs uppercase tracking-widest font-medium text-stone-900 hover:text-stone-600"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs uppercase tracking-widest font-medium text-stone-900 hover:text-stone-600"
            >
              Shop Collection
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs uppercase tracking-widest font-medium text-stone-900 hover:text-stone-600"
              >
                Admin Dashboard
              </Link>
            )}
            <div className="pt-3 border-t border-stone-200">
              {isAuthenticated ? (
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-stone-600">Signed in as {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-semibold text-red-600 uppercase tracking-wider"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 border border-stone-300 text-xs uppercase tracking-wider font-medium text-stone-900"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}


