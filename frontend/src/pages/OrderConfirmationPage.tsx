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
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="font-serif text-5xl text-stone-300">404</p>
        <h2 className="text-xl font-serif text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500 font-light">We could not locate this order record.</p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-block bg-stone-950 text-white text-xs uppercase tracking-widest font-semibold px-8 py-3.5 hover:bg-stone-800 transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Success Badge Banner */}
      <div className="bg-white border border-stone-200 p-8 sm:p-12 text-center space-y-4">
        <div className="w-12 h-12 mx-auto bg-stone-950 text-white rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-semibold">
          Order Confirmed
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
          Thank you for your order
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 font-light max-w-md mx-auto">
          We have received your order and are preparing your garments for shipment. A notification will be dispatched once on route.
        </p>

        <div className="pt-2">
          <span className="inline-block bg-stone-100 text-stone-800 text-[11px] font-mono font-medium px-4 py-2 border border-stone-200">
            Order Reference: {order.id}
          </span>
        </div>
      </div>

      {/* Order Invoice Summary */}
      <div className="bg-white border border-stone-200 mt-8 p-6 sm:p-10 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <h2 className="font-serif text-xl text-stone-950 font-normal">
            Order Summary
          </h2>
          <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-stone-100 text-stone-800 border border-stone-200">
            Status: {order.status}
          </span>
        </div>

        {/* Itemized list */}
        <div className="divide-y divide-stone-100">
          {order.order_items?.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-18 bg-[#f5f4f0] border border-stone-200 shrink-0 overflow-hidden">
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
                  <p className="font-serif text-sm text-stone-900 truncate">{item.products.name}</p>
                  <p className="text-stone-400 font-light mt-0.5">Quantity: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold text-stone-900 shrink-0">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600 font-light">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900">Rs. {order.total_amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-stone-600 font-light">
            <span>Shipping</span>
            <span className="text-emerald-700 font-medium">Complimentary</span>
          </div>
          <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-semibold text-stone-950">
            <span>Total Paid</span>
            <span>Rs. {order.total_amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping details */}
        <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
              Shipping Destination
            </p>
            <p className="font-medium text-stone-900">{order.shipping_address}</p>
            <p className="text-stone-600">{order.city}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
              Contact Phone
            </p>
            <p className="font-medium text-stone-900">{order.phone}</p>
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/shop"
          className="bg-stone-950 hover:bg-stone-800 text-white text-xs uppercase tracking-widest font-semibold px-8 py-4 text-center transition"
        >
          Continue Browsing
        </Link>
        <Link
          to="/"
          className="border border-stone-300 hover:border-stone-950 text-stone-900 text-xs uppercase tracking-widest font-semibold px-8 py-4 text-center transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
