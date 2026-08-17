import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/client';
import Loader from '../components/Loader';
import type { Order } from '../types';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await orderApi.getById(id);
        setOrder(res.data.data.order);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <Loader message="Generating receipt..." />;
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-4xl text-stone-300 font-bold">404</p>
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500 font-normal">We could not locate this order record.</p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-lg shadow-sm transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Success Badge Banner */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-8 sm:p-10 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 mx-auto bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center shadow-xs">
          <svg className="w-6 h-6 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Order Confirmed
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight">
          Thank you for your order!
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 font-normal max-w-md mx-auto">
          We have received your order and are preparing your garments for shipment. A notification will be dispatched once on route.
        </p>

        <div className="pt-2">
          <span className="inline-block bg-stone-100 text-stone-800 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-md border border-stone-200">
            Order ID: #{order.id.slice(0, 8)}
          </span>
        </div>
      </div>

      {/* Order Invoice Summary */}
      <div className="bg-white border border-stone-200/90 rounded-xl mt-6 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-950">
            Order Breakdown
          </h2>
          <span className="text-xs uppercase tracking-wider font-bold px-2.5 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent-border)] rounded-md">
            Status: {order.status}
          </span>
        </div>

        {/* Itemized list */}
        <div className="divide-y divide-stone-100">
          {order.order_items?.map((item) => (
            <div key={item.id} className="py-3.5 first:pt-0 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-15 bg-[#f7f5f1] border border-stone-200 rounded-md shrink-0 overflow-hidden">
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
                  <p className="text-stone-400 font-normal mt-0.5">Quantity: {item.quantity}</p>
                </div>
              </div>
              <span className="font-bold text-stone-950 shrink-0">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600 font-normal">
            <span>Subtotal</span>
            <span className="font-bold text-stone-900">Rs. {order.total_amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-stone-600 font-normal">
            <span>Shipping</span>
            <span className="text-[var(--color-success)] font-semibold">Complimentary</span>
          </div>
          <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-extrabold text-stone-950">
            <span>Total Paid</span>
            <span>Rs. {order.total_amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping details */}
        <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
              Shipping Destination
            </p>
            <p className="font-semibold text-stone-900">{order.shipping_address}</p>
            <p className="text-stone-600">{order.city}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
              Contact Phone
            </p>
            <p className="font-semibold text-stone-900">{order.phone}</p>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/shop"
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-lg text-center shadow-sm transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/"
          className="bg-white border border-stone-300 hover:border-stone-500 text-stone-900 text-xs uppercase tracking-wider font-bold px-8 py-3.5 rounded-lg text-center shadow-2xs transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
