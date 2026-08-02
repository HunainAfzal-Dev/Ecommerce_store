import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/client';
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
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
        <span className="text-6xl">✅</span>
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600">
          Thank you for your order! We'll process it soon.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Order ID: <span className="font-mono">{order.id}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 text-left">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-2">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.products.name} × {item.quantity}
              </span>
              <span className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-indigo-600">Rs. {order.total_amount.toLocaleString()}</span>
        </div>

        <div className="border-t pt-4 mt-4 text-sm text-gray-600 space-y-1">
          <p>
            <span className="font-medium">Shipping to:</span> {order.shipping_address}, {order.city}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {order.phone}
          </p>
          <p>
            <span className="font-medium">Status:</span> {order.status}
          </p>
        </div>
      </div>

      <Link
        to="/shop"
        className="inline-block mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

