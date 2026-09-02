import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import { productApi } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getCategoryTheme } from '../components/ProductCard';
import { Sparkles, Check } from 'lucide-react';
import type { Product } from '../types';

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colorOptions = [
  { name: 'Obsidian Black', hex: '#1c1917', bgClass: 'bg-stone-900' },
  { name: 'Warm Cognac', hex: '#9c5b3c', bgClass: 'bg-amber-800' },
  { name: 'Indigo Dye', hex: '#1e3a8a', bgClass: 'bg-blue-900' },
  { name: 'Slate Gray', hex: '#475569', bgClass: 'bg-slate-600' }
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].name);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const res = await productApi.getById(id);
        setProduct(res.data.data.product);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Garment not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      showToast('Please sign in to add garments to your bag.', 'info');
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      showToast(`${quantity} × ${product.name} (Size: ${selectedSize}) added to your bag.`, 'success');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add item to bag', 'error');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <Loader message="Presenting garment..." />;

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-4xl text-stone-300 font-bold mb-3">404</p>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Garment Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">{error || 'This piece is currently unavailable.'}</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-6 py-3.5 rounded-xl transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;
  const categoryTheme = getCategoryTheme(product.categories?.name);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24 sm:pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-medium text-stone-400 mb-6 sm:mb-8 overflow-x-auto pb-1 scrollbar-none whitespace-nowrap">
        <Link to="/" className="hover:text-stone-900 transition shrink-0">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-stone-900 transition shrink-0">Shop</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              to={`/shop?category=${product.categories.id}`}
              className={`hover:underline transition shrink-0 font-semibold ${categoryTheme.text}`}
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-800 font-semibold truncate max-w-[160px] sm:max-w-none">{product.name}</span>
      </nav>

      {/* Balanced 2-Column Product Layout with Responsive Sizing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Presentation with Floating Craft Badge */}
        <div className="lg:col-span-5 w-full">
          <div className="relative aspect-[4/5] max-h-[380px] sm:max-h-[480px] w-full bg-[#f7f5f1] border border-stone-200 rounded-3xl overflow-hidden shadow-xs mx-auto">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100/70 text-stone-400">
                <svg className="w-16 h-16 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs tracking-wider uppercase mt-2 font-medium">Garment Detail</span>
              </div>
            )}

            {/* Floating Quality Sticker */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-stone-200 shadow-md flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-widest text-stone-800"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Atelier Verified</span>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Detailed Product Info & Actions Panel */}
        <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-3xl p-5 sm:p-8 space-y-6 shadow-xs">
          {/* Header & Price with Dashboard Category Accent */}
          <div className="space-y-2 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${categoryTheme.text} ${categoryTheme.bg} px-3 py-1 rounded-md border ${categoryTheme.border}`}>
                <span className={`w-2 h-2 rounded-full ${categoryTheme.dot}`}></span>
                {product.categories?.name || 'Garments Collection'}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
              {product.name}
            </h1>
            
            <div className="pt-2 flex flex-wrap items-baseline gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500">Taxes & standard duties included</span>
            </div>
          </div>

          {/* Semantic Stock Availability */}
          <div>
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-danger)] bg-[var(--color-danger-bg)] px-3 py-1.5 rounded-lg border border-[var(--color-danger-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-danger)]"></span>
                Sold Out
              </div>
            ) : product.stock_quantity <= 3 ? (
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-warning)] bg-[var(--color-warning-bg)] px-3 py-1.5 rounded-lg border border-[var(--color-warning-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-pulse"></span>
                Low Stock — Only {product.stock_quantity} pieces remaining
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-success)] bg-[var(--color-success-bg)] px-3 py-1.5 rounded-lg border border-[var(--color-success-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
                In Stock ({product.stock_quantity} available)
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-sm text-stone-600 leading-relaxed font-normal">
            <p>{product.description || 'Crafted with premium breathable natural fibers for effortless comfort, versatile styling, and long-lasting durability.'}</p>
          </div>

          {/* Size Variant Chips */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-700">Select Size:</span>
              <span className="text-[var(--color-accent)] font-extrabold">Size {selectedSize}</span>
            </div>
            <div className="flex items-center gap-2">
              {availableSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-[var(--color-primary)] text-white shadow-xs font-extrabold'
                      : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector Dots */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-700">Color Tone:</span>
              <span className="text-stone-600 font-medium">{selectedColor}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              {colorOptions.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-7 h-7 rounded-full ${c.bgClass} transition-all flex items-center justify-center ${
                    selectedColor === c.name
                      ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={c.name}
                >
                  {selectedColor === c.name && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector & Add to Bag */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between sm:justify-start gap-4">
                <label className="text-xs uppercase tracking-wider font-bold text-stone-700">
                  Quantity:
                </label>
                <div className="inline-flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-stone-700 active:bg-stone-200 transition text-base font-bold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-sm font-extrabold text-stone-900 bg-white h-11 flex items-center justify-center border-x border-stone-200">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-11 h-11 flex items-center justify-center text-stone-700 active:bg-stone-200 transition text-base font-bold"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full min-h-[52px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-extrabold py-4 px-4 rounded-2xl shadow-md transition-all duration-150 flex items-center justify-center gap-2"
              >
                {adding ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Adding to Bag...</span>
                  </>
                ) : (
                  <span>Add to Shopping Bag &bull; Rs. {(product.price * quantity).toLocaleString()}</span>
                )}
              </button>
            </div>
          )}

          {/* Information Tabs */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex border-b border-stone-200 text-xs font-bold gap-4 sm:gap-6 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 transition-colors relative shrink-0 ${
                  activeTab === 'details'
                    ? 'text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Details & Fit
                {activeTab === 'details' && (
                  <motion.span layoutId="tab-underline" className={`absolute bottom-0 left-0 w-full h-0.5 ${categoryTheme.dot} rounded-full`} />
                )}
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`py-3 transition-colors relative shrink-0 ${
                  activeTab === 'care'
                    ? 'text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Fabric & Care
                {activeTab === 'care' && (
                  <motion.span layoutId="tab-underline" className={`absolute bottom-0 left-0 w-full h-0.5 ${categoryTheme.dot} rounded-full`} />
                )}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-3 transition-colors relative shrink-0 ${
                  activeTab === 'shipping'
                    ? 'text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Delivery & Returns
                {activeTab === 'shipping' && (
                  <motion.span layoutId="tab-underline" className={`absolute bottom-0 left-0 w-full h-0.5 ${categoryTheme.dot} rounded-full`} />
                )}
              </button>
            </div>

            <div className="py-4 text-xs text-stone-600 leading-relaxed font-normal">
              {activeTab === 'details' && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Tailored from premium breathable natural fibers</li>
                  <li>Reinforced internal seams for extended durability</li>
                  <li>Modern relaxed silhouette for versatile styling</li>
                </ul>
              )}
              {activeTab === 'care' && (
                <p>
                  Machine wash cold with similar colors on gentle cycle. Line dry in shade. Warm iron if necessary. Do not bleach.
                </p>
              )}
              {activeTab === 'shipping' && (
                <p>
                  Complimentary express shipping on orders over Rs. 5,000. Standard delivery delivers within 2–4 business days nationwide with 7-day doorstep replacement.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      {!isOutOfStock && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 shadow-xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Total</span>
            <span className="text-base font-extrabold text-stone-950 truncate">
              Rs. {(product.price * quantity).toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className="flex-1 min-h-[44px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-extrabold py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            {adding ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <span>Add to Bag ({selectedSize})</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
