import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderApi } from '../api/client';
import Loader from '../components/Loader';
import Seo from '../components/Seo';
import { formatTrackingCode, formatPkr } from '../utils/orderTracking';
import type { Order } from '../types';

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // The tracking code may arrive via router state from CheckoutPage
  const passedTrackingCode = (location.state as { trackingCode?: string } | null)?.trackingCode;

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
        <Seo title="Order not found" />
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

  const trackingCode = order.tracking_code || passedTrackingCode || null;
  const trackUrl = trackingCode
    ? `/track?ref=${encodeURIComponent(trackingCode)}`
    : '/track';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Seo
        title="Order confirmed"
        description={`Your Garments Store order ${trackingCode ? `#${trackingCode}` : ''} has been confirmed. Track shipment progress and estimated delivery.`}
      />

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
          We have received your order and are preparing your garments for shipment. A confirmation email with tracking details has been sent to your inbox.
        </p>

        {/* Prominent Tracking Code Card */}
        {trackingCode && (
          <div className="mt-4 mx-auto max-w-xs bg-[var(--color-surface-subtle)] border border-stone-200 rounded-2xl p-5 space-y-2">
            <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-stone-400">
              Order Tracking ID
            </p>
            <p className="text-xl sm:text-2xl font-mono font-extrabold text-stone-950 tracking-wider">
              {formatTrackingCode(trackingCode)}
            </p>
            <p className="text-[11px] text-stone-500 font-normal">
              Save this ID to track your shipment anytime.
            </p>
          </div>
        )}

        {/* Track Order CTA */}
        <div className="pt-3">
          <Link
            to={trackUrl}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-xs uppercase tracking-wider font-bold px-6 rounded-xl shadow-sm transition-all"
          >
            <svg className="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Track Your Order
          </Link>
        </div>
      </div>

      {/* Order Invoice Summary */}
      <div className="bg-white border border-stone-200/90 rounded-xl mt-6 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
          <h2 className="text-lg font-bold text-stone-950">
            Order Breakdown
          </h2>
          <span className="inline-flex w-fit text-xs uppercase tracking-wider font-bold px-2.5 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent-border)] rounded-md">
            {order.status_label || order.status}
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
                      alt={`${item.products.name} garment`}
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
                  <p className="text-stone-400 font-normal mt-0.5">Qty: {item.quantity} × {formatPkr(item.price)}</p>
                </div>
              </div>
              <span className="font-bold text-stone-950 shrink-0">
                {formatPkr(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
          <div className="flex justify-between text-stone-600 font-normal">
            <span>Subtotal</span>
            <span className="font-bold text-stone-900">{formatPkr(order.total_amount)}</span>
          </div>
          <div className="flex justify-between text-stone-600 font-normal">
            <span>Shipping</span>
            <span className="text-[var(--color-success)] font-semibold">Complimentary</span>
          </div>
          <div className="pt-3 border-t border-stone-100 flex justify-between text-base font-extrabold text-stone-950">
            <span>Total (COD)</span>
            <span>{formatPkr(order.total_amount)}</span>
          </div>
        </div>

        {/* COD Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <strong>Payment:</strong> Cash on Delivery (COD). Please keep the exact amount ready when your order arrives.
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

        {/* Estimated delivery */}
        {order.estimated_delivery_days != null && order.estimated_delivery_days > 0 && (
          <div className="pt-4 border-t border-stone-100 text-xs">
            <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400 mb-1">
              Estimated Delivery
            </p>
            <p className="font-semibold text-stone-900">
              {order.estimated_delivery_days} business day{order.estimated_delivery_days === 1 ? '' : 's'}
            </p>
          </div>
        )}
      </div>

      {/* Next Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/shop"
          className="min-h-[48px] inline-flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs uppercase tracking-wider font-bold px-8 rounded-xl text-center shadow-sm transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/account"
          className="min-h-[48px] inline-flex items-center justify-center bg-white border border-stone-300 hover:border-stone-500 text-stone-900 text-xs uppercase tracking-wider font-bold px-8 rounded-xl text-center shadow-2xs transition"
        >
          View Order History
        </Link>
      </div>
    </div>
  );
}
