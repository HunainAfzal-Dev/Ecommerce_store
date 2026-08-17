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
      showToast('Order confirmed! Generating invoice...', 'success');
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
      <div className="max-w-3xl mx-auto px-4 py-28 text-center space-y-4">
        <svg className="w-16 h-16 mx-auto text-stone-300 stroke-[1.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <h1 className="font-serif text-3xl text-stone-900 font-normal">Nothing to Checkout</h1>
        <p className="text-xs text-stone-500 font-light max-w-sm mx-auto">
          Your shopping bag is currently empty. Please select garments before proceeding to checkout.
        </p>
        <div className="pt-4">
          <Link
            to="/shop"
            className="inline-block bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 transition"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 pb-4 border-b border-stone-200">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-500">
          Secure Checkout
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal mt-1">
          Delivery Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Shipping Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-6 sm:p-10 space-y-6">
            <h2 className="font-serif text-xl text-stone-950 font-normal pb-4 border-b border-stone-200">
              Shipping Destination
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                  Complete Address *
                </label>
                <textarea
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 rounded-none transition"
                  placeholder="Apartment, suite, unit, building, floor, street address..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                    City / Region *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 rounded-none transition"
                    placeholder="e.g. Karachi, Lahore, Islamabad"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-950 rounded-none transition"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-stone-950 hover:bg-stone-800 disabled:opacity-50 text-white text-xs uppercase tracking-widest font-semibold py-4 transition-all duration-200 flex items-center justify-center gap-2"
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
          <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-xl text-stone-950 font-normal pb-4 border-b border-stone-200">
              Order Review
            </h2>

            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-14 bg-[#f5f4f0] border border-stone-200 shrink-0 overflow-hidden">
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
                      <p className="font-medium text-stone-900 truncate">{item.products.name}</p>
                      <p className="text-stone-400 font-light">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900 shrink-0">
                    Rs. {(item.products.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600 font-light">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600 font-light">
                <span>Shipping</span>
                <span className="text-emerald-700 font-medium">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-semibold text-stone-950">
                <span>Total Amount</span>
                <span>Rs. {cartTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/cart"
                className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 transition"
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
