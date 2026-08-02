import { useEffect, useState } from 'react';
import { orderApi } from '../../api/client';
import type { Order } from '../../types';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderApi.getAll();
      setOrders(res.data.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await orderApi.updateStatus(orderId, status);
      await fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-4xl mb-4">📦</p>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500">Customer orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Order Info */}
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.users?.name} · {order.users?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    📍 {order.shipping_address}, {order.city}
                  </p>
                  <p className="text-sm text-gray-500">📞 {order.phone}</p>
                </div>

                {/* Total + Status */}
                <div className="text-right">
                  <p className="text-xl font-bold text-indigo-600">
                    Rs. {order.total_amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>

              {/* Items */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="space-y-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.products.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="mt-4 flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Update Status:</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

