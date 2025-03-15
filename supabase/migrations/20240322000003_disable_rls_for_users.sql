-- Disable RLS for users table to allow registration
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users only" ON users;
DROP POLICY IF EXISTS "Public access" ON users;
