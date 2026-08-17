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
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-5xl text-stone-300 mb-3">404</p>
        <h2 className="text-xl font-serif text-stone-900 mb-2">Garment Not Found</h2>
        <p className="text-xs text-stone-500 mb-8">{error || 'This piece is currently unavailable.'}</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-stone-950 text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 hover:bg-stone-800 transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-stone-400 mb-8 overflow-x-auto">
        <Link to="/" className="hover:text-stone-900 transition shrink-0">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-stone-900 transition shrink-0">Shop</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              to={`/shop?category=${product.categories.id}`}
              className="hover:text-stone-900 transition shrink-0"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-stone-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Dominant Product Image Gallery */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[3/4] bg-[#f5f4f0] border border-stone-200 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400">
                <svg className="w-20 h-20 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-xs tracking-widest uppercase mt-3 font-medium">Garment Detail</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Product Info & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header / Category */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500">
                {product.categories?.name || 'Garments Collection'}
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-950 font-normal mt-2">
                {product.name}
              </h1>
              <div className="mt-4 flex items-baseline gap-4">
                <span className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                  Rs. {product.price.toLocaleString()}
                </span>
                <span className="text-xs text-stone-500 font-light">Taxes included</span>
              </div>
            </div>

            {/* Stock Availability */}
            <div className="pt-2 border-t border-stone-200">
              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1.5 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Sold Out
                </div>
              ) : product.stock_quantity <= 3 ? (
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                  Low Stock — Only {product.stock_quantity} remaining
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  In Stock ({product.stock_quantity} available)
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              <p>{product.description || 'Crafted with premium natural fibers for effortless wearability and timeless appeal.'}</p>
            </div>

            {/* Quantity Selector & Add to Bag */}
            {!isOutOfStock && (
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="flex items-center gap-4">
                  <label className="text-xs uppercase tracking-widest font-semibold text-stone-700">
                    Quantity
                  </label>
                  <div className="inline-flex items-center border border-stone-300 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-sm"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-xs font-semibold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="w-9 h-9 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition text-sm"
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
                  className="w-full bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold py-4 transition-all duration-200 flex items-center justify-center gap-2"
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

            {/* Editorial Information Tabs */}
            <div className="pt-6 border-t border-stone-200">
              <div className="flex border-b border-stone-200 text-xs uppercase tracking-wider font-semibold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-3 pr-4 transition-colors relative ${
                    activeTab === 'details' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Details
                  {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-950" />}
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-3 px-4 transition-colors relative ${
                    activeTab === 'care' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Care Guide
                  {activeTab === 'care' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-950" />}
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 pl-4 transition-colors relative ${
                    activeTab === 'shipping' ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Delivery
                  {activeTab === 'shipping' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-950" />}
                </button>
              </div>

              <div className="py-4 text-xs text-stone-500 font-light leading-relaxed">
                {activeTab === 'details' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>Constructed with premium breathable fibers</li>
                    <li>Reinforced internal seams for durability</li>
                    <li>Designed for a relaxed, contemporary drape</li>
                  </ul>
                )}
                {activeTab === 'care' && (
                  <p>
                    Machine wash cold on gentle cycle with similar colors. Line dry in shade. Warm iron if needed. Do not bleach.
                  </p>
                )}
                {activeTab === 'shipping' && (
                  <p>
                    Complimentary express shipping on orders over Rs. 5,000. Standard delivery delivers within 3–5 business days nationwide.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
