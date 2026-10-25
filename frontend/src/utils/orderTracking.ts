export const STATUS_PIPELINE = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'processing', label: 'Processing with Vendor' },
  { key: 'shipped', label: 'Dispatched' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  processing: 'Processing with Vendor',
  shipped: 'Dispatched',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export function formatTrackingCode(code?: string | null) {
  if (!code) return '—';
  const normalized = code.replace(/^#/, '').toUpperCase();
  return `#${normalized}`;
}

export function formatPkr(amount: number) {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
}

export function formatDeliveryDate(iso?: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
