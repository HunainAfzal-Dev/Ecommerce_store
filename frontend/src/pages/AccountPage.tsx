import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import Loader from '../components/Loader';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import { orderApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatPkr, formatTrackingCode } from '../utils/orderTracking';
import type { Order } from '../types';

export default function AccountPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.data.data.orders || []);
      } catch (err) {
        console.error('Failed to load order history', err);
      } finally {
        setLoading(false);
      }
    };
    void fetchOrders();
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Seo
        title="Your account"
        description="View your Garments Store order history, tracking statuses, and estimated delivery timelines."
      />

      <div className="mb-8 pb-4 border-b border-stone-200">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
          Member profile
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight mt-0.5">
          {user?.name?.split(' ')[0] || 'Account'}
        </h1>
        <p className="text-xs text-stone-500 mt-1">{user?.email}</p>
      </div>

      <h2 className="text-lg font-bold text-stone-950 mb-4">Order history</h2>

      {loading ? (
        <Loader message="Loading your orders..." />
      ) : orders.length === 0 ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-10 text-center space-y-3 shadow-xs">
          <p className="text-sm font-bold text-stone-800">No orders yet</p>
          <p className="text-xs text-stone-500">When you place an order, tracking will appear here.</p>
          <Link
            to="/shop"
            className="inline-flex min-h-[48px] items-center justify-center bg-[var(--color-primary)] text-white text-xs uppercase tracking-wider font-bold px-6 rounded-xl"
          >
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const open = expandedId === order.id;
            return (
              <article
                key={order.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-mono font-bold text-stone-950">
                      {formatTrackingCode(order.tracking_code)}
                    </p>
                    <p className="text-xs text-stone-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent'} · {order.status_label || order.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-stone-950">{formatPkr(order.total_amount)}</span>
                    <button
                      type="button"
                      onClick={() => setExpandedId(open ? null : order.id)}
                      className="min-h-[44px] px-3 text-xs uppercase tracking-wider font-bold text-stone-700 border border-stone-300 rounded-xl"
                    >
                      {open ? 'Hide' : 'Track'}
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="mt-5 pt-5 border-t border-stone-100">
                    <OrderTrackingTimeline
                      compact
                      trackingCode={order.tracking_code}
                      statusLabel={order.status_label}
                      timeline={order.timeline}
                      estimatedDeliveryDays={order.estimated_delivery_days}
                      estimatedDeliveryDate={order.estimated_delivery_date}
                      totalAmount={order.total_amount}
                      shippingAddress={order.shipping_address}
                      city={order.city}
                    />
                    <Link
                      to={`/track?ref=${encodeURIComponent(order.tracking_code || '')}`}
                      className="inline-block mt-4 text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]"
                    >
                      Open full tracking page →
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
