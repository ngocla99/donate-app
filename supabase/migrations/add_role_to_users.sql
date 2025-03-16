-- Add role column to users table
ALTER TABLE public.users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

-- Create index on role for faster lookups
CREATE INDEX idx_users_role ON public.users(role);

-- Set up a policy to allow admins to access all data
CREATE POLICY "Allow admins full access" ON public.users
  USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'admin'));