-- Create bank_transactions table for the Excel upload
CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL,
  doc_number TEXT,
  debit DECIMAL DEFAULT 0,
  credit DECIMAL DEFAULT 0,
  balance DECIMAL NOT NULL,
  description TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policy for bank_transactions table
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;

-- Allow admin users to insert and update bank_transactions
CREATE POLICY "Allow admin users to manage bank_transactions"
  ON public.bank_transactions
  USING (
    auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin')
  );

-- Allow all authenticated users to view bank_transactions
CREATE POLICY "Allow all authenticated users to view bank_transactions"
  ON public.bank_transactions FOR SELECT
  TO authenticated
  USING (true);