import type { TrackingStep } from '../types';
import { formatDeliveryDate, formatPkr, formatTrackingCode } from '../utils/orderTracking';

interface OrderTrackingTimelineProps {
  trackingCode?: string | null;
  statusLabel?: string;
  timeline?: TrackingStep[];
  estimatedDeliveryDays?: number | null;
  estimatedDeliveryDate?: string | null;
  totalAmount?: number;
  shippingAddress?: string;
  city?: string;
  compact?: boolean;
}

export default function OrderTrackingTimeline({
  trackingCode,
  statusLabel,
  timeline = [],
  estimatedDeliveryDays,
  estimatedDeliveryDate,
  totalAmount,
  shippingAddress,
  city,
  compact = false,
}: OrderTrackingTimelineProps) {
  const deliveryCopy =
    estimatedDeliveryDays === 0
      ? 'Delivered'
      : estimatedDeliveryDays == null
        ? 'Cancelled — delivery no longer scheduled'
        : `${estimatedDeliveryDays} day${estimatedDeliveryDays === 1 ? '' : 's'} · ${formatDeliveryDate(estimatedDeliveryDate) || 'TBC'}`;

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Tracking ID</p>
          <p className="font-mono font-extrabold text-stone-950 text-lg">{formatTrackingCode(trackingCode)}</p>
        </div>
        {statusLabel && (
          <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold bg-[var(--color-accent-light)] text-[var(--color-accent)] border border-[var(--color-accent-border)]">
            {statusLabel}
          </span>
        )}
      </div>

      <ol className="space-y-3">
        {timeline.map((step) => (
          <li key={step.key} className="flex items-start gap-3">
            <span
              className={`mt-0.5 w-3.5 h-3.5 rounded-full shrink-0 border ${
                step.state === 'complete'
                  ? 'bg-emerald-600 border-emerald-600'
                  : step.state === 'current'
                    ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
                    : 'bg-white border-stone-300'
              }`}
            />
            <div>
              <p className={`text-xs font-bold ${step.state === 'upcoming' ? 'text-stone-400' : 'text-stone-900'}`}>
                {step.label}
              </p>
              {step.state === 'current' && (
                <p className="text-[11px] text-stone-500">Current status</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl p-3">
          <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Estimated delivery</p>
          <p className="font-semibold text-stone-900 mt-1">{deliveryCopy}</p>
        </div>
        {typeof totalAmount === 'number' && (
          <div className="bg-[var(--color-surface-subtle)] border border-stone-200/80 rounded-xl p-3">
            <p className="text-[10px] uppercase tracking-wider font-bold text-stone-400">Order total · COD</p>
            <p className="font-semibold text-stone-900 mt-1">{formatPkr(totalAmount)}</p>
          </div>
        )}
      </div>

      {(shippingAddress || city) && (
        <p className="text-xs text-stone-600">
          Shipping to {shippingAddress}{city ? `, ${city}` : ''}
        </p>
      )}
    </div>
  );
}
