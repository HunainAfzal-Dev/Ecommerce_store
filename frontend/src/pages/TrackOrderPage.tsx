import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import { orderApi } from '../api/client';
import type { PublicTrackedOrder } from '../types';

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const preset = searchParams.get('ref') || '';
  const [code, setCode] = useState(preset);
  const [order, setOrder] = useState<PublicTrackedOrder | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const lookup = async (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setError('Enter your order tracking ID to continue.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await orderApi.track(trimmed);
      setOrder(res.data.data.order);
      setSearchParams({ ref: trimmed.replace(/^#/, '') }, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'We could not find an order for that tracking ID.';
      setOrder(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (preset) {
      void lookup(preset);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset]);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      <Seo
        title="Track your order"
        description="Enter your Garments Store tracking ID to see live order status, dispatch progress, and estimated delivery."
      />

      <div className="mb-8 pb-4 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Client Care
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight mt-0.5">
          Track your order
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-xl">
          Enter the tracking ID from your confirmation email (for example #ORD-AB12CD).
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void lookup(code);
        }}
        className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4"
      >
        <label className="block text-xs uppercase tracking-wider font-bold text-stone-700">
          Order tracking ID
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ORD-XXXXXX"
            className="flex-1 min-h-[48px] px-3.5 py-3 bg-white border border-stone-300 rounded-xl text-sm font-mono text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--color-primary)]"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] px-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-bold rounded-xl"
          >
            {loading ? 'Looking up…' : 'Track'}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}
      </form>

      {order && (
        <div className="mt-6 bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
          <OrderTrackingTimeline
            trackingCode={order.tracking_code}
            statusLabel={order.status_label}
            timeline={order.timeline}
            estimatedDeliveryDays={order.estimated_delivery_days}
            estimatedDeliveryDate={order.estimated_delivery_date}
            totalAmount={order.total_amount}
            shippingAddress={order.shipping_address}
            city={order.city}
          />

          {order.order_items && order.order_items.length > 0 && (
            <div className="border-t border-stone-100 pt-4 space-y-3">
              <h2 className="text-sm font-bold text-stone-950">Items</h2>
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-14 bg-[#f7f5f1] border border-stone-200 rounded-md overflow-hidden shrink-0">
                      {item.products.image_url ? (
                        <img
                          src={item.products.image_url}
                          alt={`${item.products.name} garment`}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 truncate">{item.products.name}</p>
                      <p className="text-stone-400">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
