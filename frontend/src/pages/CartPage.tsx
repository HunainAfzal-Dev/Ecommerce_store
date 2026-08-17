import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRemove = async (id: string, name: string) => {
    await removeFromCart(id);
    showToast(`${name} removed from your shopping bag.`, 'info');
  };

  const handleClear = async () => {
    await clearCart();
    showToast('Shopping bag cleared.', 'info');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold animate-pulse">
          Reviewing your bag...
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <svg className="w-16 h-16 mx-auto text-stone-300 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-stone-500 font-normal max-w-sm mx-auto">
          You have no items in your shopping bag. Discover our latest garments and essential silhouettes.
        </p>
        <div className="pt-4">
          <Link
            to="/shop"
            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-lg shadow-sm transition"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-stone-200 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
            Review
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight mt-0.5">
            Shopping Bag ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={handleClear}
          className="text-xs uppercase tracking-wider font-semibold text-stone-400 hover:text-red-700 transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Bag Items List */}
        <div className="lg:col-span-8 divide-y divide-stone-200 bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs">
          {cartItems.map((item) => (
            <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex gap-4 sm:gap-6">
              {/* Product Thumbnail */}
              <Link
                to={`/product/${item.products.id}`}
                className="w-20 sm:w-24 aspect-[4/5] bg-[#f7f5f1] border border-stone-200 rounded-lg shrink-0 overflow-hidden"
              >
                {item.products.image_url ? (
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <svg className="w-8 h-8 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Product Info & Controls */}
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/product/${item.products.id}`}
                      className="font-bold text-sm sm:text-base text-stone-900 hover:text-[var(--color-accent)] transition line-clamp-1"
                    >
                      {item.products.name}
                    </Link>
                    <span className="font-extrabold text-sm sm:text-base text-stone-950 shrink-0">
                      Rs. {(item.products.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-normal">
                    Unit: Rs. {item.products.price.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3">
                  {/* Quantity Stepper */}
                  <div className="inline-flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition text-xs font-semibold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-stone-900 bg-white h-7 flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition text-xs font-semibold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.products.name)}
                    className="text-xs font-semibold text-stone-400 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 space-y-6 sticky top-28 shadow-xs">
            <h2 className="text-lg font-bold text-stone-950 pb-3 border-b border-stone-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-stone-600 font-normal">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-600 font-normal">
                <span>Shipping Estimate</span>
                <span className="text-[var(--color-success)] font-semibold">
                  {cartTotal >= 5000 ? 'Complimentary' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-extrabold text-stone-950">
                <span>Estimated Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold py-3.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
            >
              Proceed to Checkout &rarr;
            </button>

            <div className="pt-1 text-center">
              <Link
                to="/shop"
                className="text-xs font-semibold text-stone-500 hover:text-[var(--color-accent)] transition"
              >
                &larr; Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
