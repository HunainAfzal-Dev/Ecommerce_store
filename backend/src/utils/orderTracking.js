/**
 * Order tracking helpers — shared labels, codes, and delivery estimates.
 */

const STATUS_PIPELINE = [
    { key: 'pending', label: 'Order Placed' },
    { key: 'processing', label: 'Processing with Vendor' },
    { key: 'shipped', label: 'Dispatched' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
];

const STATUS_LABELS = {
    pending: 'Order Placed',
    processing: 'Processing with Vendor',
    shipped: 'Dispatched',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
};

const ESTIMATED_DAYS = {
    pending: 5,
    processing: 5,
    shipped: 3,
    out_for_delivery: 1,
    delivered: 0,
    cancelled: null
};

const ALLOWED_STATUSES = [
    'pending',
    'processing',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled'
];

const generateTrackingCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let suffix = '';
    for (let i = 0; i < 6; i += 1) {
        suffix += chars[Math.floor(Math.random() * chars.length)];
    }
    return `ORD-${suffix}`;
};

const normalizeTrackingCode = (input) =>
    String(input || '')
        .trim()
        .toUpperCase()
        .replace(/^#/, '');

const getStatusLabel = (status) => STATUS_LABELS[status] || 'Order Placed';

const getEstimatedDeliveryDays = (status) =>
    Object.prototype.hasOwnProperty.call(ESTIMATED_DAYS, status)
        ? ESTIMATED_DAYS[status]
        : 5;

const getEstimatedDeliveryDate = (createdAt, status) => {
    const days = getEstimatedDeliveryDays(status);
    if (days === null) return null;
    const base = createdAt ? new Date(createdAt) : new Date();
    if (Number.isNaN(base.getTime())) return null;
    const date = new Date(base);
    date.setDate(date.getDate() + days);
    return date.toISOString();
};

const buildTrackingTimeline = (status) => {
    if (status === 'cancelled') {
        return [
            {
                key: 'cancelled',
                label: 'Cancelled',
                state: 'current'
            }
        ];
    }

    const currentIndex = STATUS_PIPELINE.findIndex((step) => step.key === status);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return STATUS_PIPELINE.map((step, index) => ({
        ...step,
        state: index < activeIndex ? 'complete' : index === activeIndex ? 'current' : 'upcoming'
    }));
};

const withTrackingMeta = (order) => {
    if (!order) return order;
    const status = order.status || 'pending';
    return {
        ...order,
        tracking_code: order.tracking_code || null,
        status_label: getStatusLabel(status),
        estimated_delivery_days: getEstimatedDeliveryDays(status),
        estimated_delivery_date: getEstimatedDeliveryDate(order.created_at, status),
        timeline: buildTrackingTimeline(status),
        payment_method: 'Cash on Delivery (COD)'
    };
};

module.exports = {
    STATUS_PIPELINE,
    STATUS_LABELS,
    ALLOWED_STATUSES,
    generateTrackingCode,
    normalizeTrackingCode,
    getStatusLabel,
    getEstimatedDeliveryDays,
    getEstimatedDeliveryDate,
    buildTrackingTimeline,
    withTrackingMeta
};
