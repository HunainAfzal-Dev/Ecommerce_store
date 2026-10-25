-- ============================================================
-- Order tracking: public reference codes + extra status
-- Run this in the Supabase SQL editor (does not drop tables).
-- ============================================================

ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS tracking_code TEXT;

ALTER TABLE public.orders
    DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
    ADD CONSTRAINT orders_status_check
    CHECK (status IN (
        'pending',
        'processing',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled'
    ));

UPDATE public.orders
SET tracking_code = 'ORD-' || UPPER(SUBSTRING(REPLACE(id::text, '-', ''), 1, 6))
WHERE tracking_code IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_tracking_code
    ON public.orders (tracking_code);
