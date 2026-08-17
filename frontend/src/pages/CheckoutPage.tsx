import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderApi } from '../api/client';
import { useToast } from '../context/ToastContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    shipping_address: '',
    city: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await orderApi.create(form);
      await clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-confirmation/${response.data.data.order.id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to place order';
      setError(msg);
      showToast(msg, 'error');
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <svg className="w-16 h-16 mx-auto text-stone-300 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
          Nothing to Checkout
        </h1>
        <p className="text-xs text-stone-500 font-normal max-w-sm mx-auto">
          Your shopping bag is currently empty. Please select garments before proceeding to checkout.
        </p>
        <div className="pt-4">
          <Link
            to="/shop"
            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-lg shadow-sm transition"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Secure Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight mt-0.5">
          Delivery Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Shipping Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold text-stone-950 pb-3 border-b border-stone-100">
              Shipping Destination
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                  Complete Address *
                </label>
                <textarea
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
                  placeholder="House / Apartment #, Street, Area..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                    City / Region *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
                    placeholder="e.g. Karachi, Lahore"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-stone-700 mb-1.5">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)] transition"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-bold py-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>Place Order &bull; Rs. {cartTotal.toLocaleString()}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Order Review Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white border border-stone-200/90 rounded-xl p-6 space-y-6 sticky top-28 shadow-xs">
            <h2 className="text-lg font-bold text-stone-950 pb-3 border-b border-stone-100">
              Order Review
            </h2>

            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-14 bg-[#f7f5f1] border border-stone-200 rounded-md shrink-0 overflow-hidden">
                      {item.products.image_url ? (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          👕
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 truncate">{item.products.name}</p>
                      <p className="text-stone-400 font-normal">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-950 shrink-0">
                    Rs. {(item.products.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600 font-normal">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600 font-normal">
                <span>Shipping</span>
                <span className="text-[var(--color-success)] font-semibold">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-extrabold text-stone-950">
                <span>Total Amount</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-1 text-center">
              <Link
                to="/cart"
                className="text-xs font-semibold text-stone-500 hover:text-[var(--color-accent)] transition"
              >
                &larr; Modify Bag Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
