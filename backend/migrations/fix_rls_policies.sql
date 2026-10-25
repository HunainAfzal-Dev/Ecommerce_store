-- Run this in Supabase SQL Editor → New Query → Run

-- Allow authenticated users to INSERT their own orders
DROP POLICY IF EXISTS "Users insert own orders" ON public.orders;
CREATE POLICY "Users insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to INSERT order_items for their orders
DROP POLICY IF EXISTS "Users insert own order_items" ON public.order_items;
CREATE POLICY "Users insert own order_items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

-- Allow users to read their own order_items
DROP POLICY IF EXISTS "Users read own order_items" ON public.order_items;
CREATE POLICY "Users read own order_items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE id = order_id AND user_id = auth.uid()
        )
    );
