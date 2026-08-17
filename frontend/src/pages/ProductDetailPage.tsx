import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { productApi } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Product } from '../types';

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
      showToast(`${quantity} × ${product.name} added to your bag.`, 'success');
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
        <h2 className="text-xl font-semibold text-stone-900 mb-2">Garment Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">{error || 'This piece is currently unavailable.'}</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-lg transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-medium text-stone-400 mb-8 overflow-x-auto">
        <Link to="/" className="hover:text-[var(--color-accent)] transition shrink-0">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[var(--color-accent)] transition shrink-0">Shop</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              to={`/shop?category=${product.categories.id}`}
              className="hover:text-[var(--color-accent)] transition shrink-0"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-800 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Balanced 2-Column Product Layout with Controlled Image Size */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Controlled Sized Image Presentation */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] max-h-[480px] w-full bg-[#f7f5f1] border border-stone-200 rounded-xl overflow-hidden shadow-xs mx-auto">
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
          </div>
        </div>

        {/* Right Column: Detailed Product Info & Actions Panel */}
        <div className="lg:col-span-7 bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Header & Price */}
          <div className="space-y-2 pb-4 border-b border-stone-100">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent-light)] px-2.5 py-1 rounded-md border border-[var(--color-accent-border)]">
              {product.categories?.name || 'Garments Collection'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight">
              {product.name}
            </h1>
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-stone-950 tracking-tight">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500">Taxes & standard duties included</span>
            </div>
          </div>

          {/* Stock Availability */}
          <div>
            {isOutOfStock ? (
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Sold Out
              </div>
            ) : product.stock_quantity <= 3 ? (
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-warning)] bg-[var(--color-warning-bg)] px-3 py-1.5 rounded-lg border border-[var(--color-warning-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-pulse"></span>
                Low Stock — Only {product.stock_quantity} left
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-success)] bg-[var(--color-success-bg)] px-3 py-1.5 rounded-lg border border-[var(--color-success-border)]">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
                In Stock ({product.stock_quantity} available)
              </div>
            )}
          </div>

          {/* Description */}
          <div className="text-sm text-stone-600 leading-relaxed font-normal">
            <p>{product.description || 'Crafted with premium breathable fibers for effortless comfort, versatile styling, and long-lasting durability.'}</p>
          </div>

          {/* Quantity Selector & Add to Bag */}
          {!isOutOfStock && (
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center gap-4">
                <label className="text-xs uppercase tracking-wider font-semibold text-stone-700">
                  Quantity:
                </label>
                <div className="inline-flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition font-semibold"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-stone-900 bg-white h-9 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition font-semibold"
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
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white text-xs uppercase tracking-widest font-bold py-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
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
          <div className="pt-6 border-t border-stone-100">
            <div className="flex border-b border-stone-200 text-xs font-semibold gap-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'details'
                    ? 'text-[var(--color-accent)] font-bold'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Details & Fit
                {activeTab === 'details' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'care'
                    ? 'text-[var(--color-accent)] font-bold'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Fabric & Care
                {activeTab === 'care' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 transition-colors relative ${
                  activeTab === 'shipping'
                    ? 'text-[var(--color-accent)] font-bold'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Delivery & Returns
                {activeTab === 'shipping' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)] rounded-full" />
                )}
              </button>
            </div>

            <div className="py-4 text-xs text-stone-600 leading-relaxed font-normal">
              {activeTab === 'details' && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Tailored from premium breathable fibers</li>
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
                  Complimentary express shipping on orders over Rs. 5,000. Standard delivery delivers within 3–5 business days nationwide with doorstep replacement.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
