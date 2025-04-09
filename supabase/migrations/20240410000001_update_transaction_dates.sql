-- Add 1 day to all transaction_date values in bank_transactions table
UPDATE public.bank_transactions
SET transaction_date = transaction_date + INTERVAL '1 day';

-- Add a comment to record this migration
COMMENT ON TABLE public.bank_transactions IS 'Transaction dates were adjusted by +1 day on 2024-04-10';