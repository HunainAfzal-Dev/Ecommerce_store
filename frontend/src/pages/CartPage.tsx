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
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-4">
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
            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] text-white text-xs uppercase tracking-wider font-bold px-8 py-4 rounded-xl shadow-sm transition min-h-[48px]"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-stone-200 flex items-baseline justify-between">
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
          className="text-xs uppercase tracking-wider font-bold text-stone-400 hover:text-red-700 active:text-red-800 transition py-1"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12">
        {/* Left Column: Mobile Stacked Card Layout */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 flex gap-3.5 sm:gap-6 shadow-xs relative overflow-hidden"
            >
              {/* Product Thumbnail */}
              <Link
                to={`/product/${item.products.id}`}
                className="w-20 sm:w-24 aspect-[4/5] bg-[#f7f5f1] border border-stone-200 rounded-xl shrink-0 overflow-hidden"
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
              <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                <div className="space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <Link
                      to={`/product/${item.products.id}`}
                      className="font-bold text-sm sm:text-base text-stone-900 hover:text-[var(--color-accent)] transition line-clamp-1 truncate"
                    >
                      {item.products.name}
                    </Link>
                  </div>
                  <p className="text-xs text-stone-500 font-normal">
                    Unit: Rs. {item.products.price.toLocaleString()}
                  </p>
                  <p className="text-sm font-extrabold text-stone-950 sm:hidden">
                    Total: Rs. {(item.products.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {/* Quantity Stepper with 36px+ touch target */}
                  <div className="inline-flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-stone-700 active:bg-stone-200 transition text-sm font-bold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 sm:w-9 text-center text-xs font-bold text-stone-900 bg-white h-8 sm:h-9 flex items-center justify-center border-x border-stone-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-stone-700 active:bg-stone-200 transition text-sm font-bold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <span className="hidden sm:block font-extrabold text-base text-stone-950">
                    Rs. {(item.products.price * item.quantity).toLocaleString()}
                  </span>

                  {/* Remove Action Button */}
                  <button
                    onClick={() => handleRemove(item.id, item.products.name)}
                    className="text-xs font-bold text-[var(--color-danger)] hover:underline active:opacity-70 transition py-1.5 px-2 rounded-md"
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
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 space-y-5 sticky top-24 shadow-xs">
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
                <span>Shipping</span>
                <span className="text-[var(--color-success)] font-semibold">
                  {cartTotal >= 5000 ? 'Complimentary' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between text-base sm:text-lg font-extrabold text-stone-950">
                <span>Estimated Total</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full min-h-[48px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] text-white text-xs uppercase tracking-wider font-bold py-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout &rarr;</span>
            </button>

            <div className="pt-1 text-center">
              <Link
                to="/shop"
                className="text-xs font-bold text-stone-500 hover:text-[var(--color-accent)] transition py-1 inline-block"
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
