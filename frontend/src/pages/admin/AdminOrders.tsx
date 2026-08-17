import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Loader from '../../components/Loader';
import { orderApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { Order } from '../../types';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  processing: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  shipped: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
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
      showToast(`Order #${orderId.slice(0, 8)} status set to "${status}".`, 'success');
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
            className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wider font-medium transition ${
              filterStatus === 'all'
                ? 'bg-stone-950 text-white'
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
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wider font-medium transition ${
                  filterStatus === status
                    ? 'bg-stone-950 text-white'
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
          <div className="bg-white border border-stone-200 p-16 text-center space-y-3">
            <p className="font-serif text-2xl text-stone-400">No Orders Found</p>
            <p className="text-xs text-stone-500 font-light">
              There are currently no orders in the "{filterStatus}" status pipeline.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const currentStyle = statusStyles[order.status] || statusStyles.pending;
              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 hover:border-stone-300 transition"
                >
                  {/* Top Bar: Order ID, Date, Status, Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-sm text-stone-950">
                          #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 font-light">
                        Placed on {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-serif text-xl sm:text-2xl text-stone-950 font-normal">
                        Rs. {order.total_amount.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium">Standard Delivery Included</p>
                    </div>
                  </div>

                  {/* Middle: Customer Details & Items Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                    {/* Customer Info */}
                    <div className="md:col-span-4 space-y-2 bg-[#faf9f6] p-4 border border-stone-200/80">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                        Client Information
                      </p>
                      <p className="font-semibold text-stone-900">{order.users?.name || 'Customer'}</p>
                      <p className="text-stone-500 font-light">{order.users?.email || '—'}</p>
                      <p className="text-stone-600 font-medium pt-1">📞 {order.phone}</p>
                      <p className="text-stone-500 font-light">📍 {order.shipping_address}, {order.city}</p>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-8 space-y-3">
                      <p className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                        Garments Ordered ({order.order_items?.length || 0})
                      </p>
                      <div className="divide-y divide-stone-100">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="py-2.5 first:pt-0 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-12 bg-[#f5f4f0] border border-stone-200 shrink-0 overflow-hidden">
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
                                <p className="font-medium text-stone-900 truncate">{item.products?.name}</p>
                                <p className="text-stone-400 font-light">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-semibold text-stone-900 shrink-0">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Status Changer */}
                  <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-stone-500 font-light">
                      Update order lifecycle status:
                    </span>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-stone-300 text-stone-900 text-xs focus:outline-none focus:border-stone-950 rounded-none disabled:opacity-50"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            Set to: {status.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      {updatingId === order.id && (
                        <span className="text-[11px] text-stone-400 animate-pulse">
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
