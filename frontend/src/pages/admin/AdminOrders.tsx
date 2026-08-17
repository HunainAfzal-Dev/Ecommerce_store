import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { orderApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { Order } from '../../types';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning)]', border: 'border-[var(--color-warning-border)]' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  delivered: { bg: 'bg-[var(--color-success-bg)]', text: 'text-[var(--color-success)]', border: 'border-[var(--color-success-border)]' },
  cancelled: { bg: 'bg-stone-100', text: 'text-stone-600', border: 'border-stone-200' }
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAll();
      setOrders(res.data.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
      showToast('Failed to retrieve orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateStatus(orderId, status);
      showToast(`Order #${orderId.slice(0, 8)} status updated to "${status}".`, 'success');
      await fetchOrders();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  return (
    <AdminLayout
      title="Fulfillment & Orders"
      subtitle="Track customer shipments, process dispatches, and manage fulfillment statuses."
    >
      <div className="space-y-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilterStatus('all')}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition ${
              filterStatus === 'all'
                ? 'bg-[var(--color-primary)] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
            }`}
          >
            All Orders ({orders.length})
          </button>
          {statusOptions.map((status) => {
            const count = orders.filter((o) => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition ${
                  filterStatus === status
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <Loader message="Loading orders..." />
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-stone-200/90 rounded-xl p-16 text-center space-y-3 shadow-xs">
            <p className="text-2xl font-bold text-stone-400">No Orders Found</p>
            <p className="text-xs text-stone-500 font-normal">
              There are currently no orders in the "{filterStatus}" status pipeline.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const currentStyle = statusStyles[order.status] || statusStyles.pending;
              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200/90 rounded-xl p-6 sm:p-7 space-y-5 hover:border-stone-300 transition shadow-xs"
                >
                  {/* Top Bar: Order ID, Date, Status, Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-sm text-stone-950">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-md border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-normal">
                        Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xl sm:text-2xl font-extrabold text-stone-950 tracking-tight">
                        Rs. {order.total_amount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-[var(--color-success)] font-semibold">Delivery Included</p>
                    </div>
                  </div>

                  {/* Middle: Customer Details & Items Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                    {/* Customer Info */}
                    <div className="md:col-span-4 space-y-1.5 bg-[var(--color-surface-subtle)] p-4 rounded-lg border border-stone-200/70">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                        Client Information
                      </span>
                      <p className="font-bold text-stone-900">{order.users?.name || 'Customer'}</p>
                      <p className="text-stone-500 font-normal">{order.users?.email || '—'}</p>
                      <p className="text-stone-700 font-semibold pt-1">📞 {order.phone}</p>
                      <p className="text-stone-500 font-normal">📍 {order.shipping_address}, {order.city}</p>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-8 space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                        Garments Ordered ({order.order_items?.length || 0})
                      </span>
                      <div className="divide-y divide-stone-100">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="py-2 first:pt-0 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-10 bg-[#f7f5f1] border border-stone-200 rounded-md shrink-0 overflow-hidden">
                                {item.products?.image_url ? (
                                  <img
                                    src={item.products.image_url}
                                    alt={item.products.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                                    👕
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-stone-900 truncate">{item.products?.name}</p>
                                <p className="text-stone-400 font-normal">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold text-stone-950 shrink-0">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Status Changer */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-stone-500 font-normal">
                      Update order lifecycle status:
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-stone-900 text-xs focus:outline-none focus:border-[var(--color-primary)] font-semibold disabled:opacity-50"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            Set to: {status.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      {updatingId === order.id && (
                        <span className="text-xs text-stone-400 animate-pulse">
                          Updating...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
