-- Run this in Supabase Dashboard → SQL Editor → New Query → Run

-- Add tracking_code column to orders table (if it doesn't exist)
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE;

-- Refresh the PostgREST schema cache so the new column is visible
NOTIFY pgrst, 'reload schema';
