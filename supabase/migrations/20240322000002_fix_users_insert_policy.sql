-- Allow service role to insert into users table
DROP POLICY IF EXISTS "Service role can insert users" ON users;
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Alternatively, you could use a more restrictive policy like:
-- WITH CHECK (auth.uid() = id OR auth.jwt()->>'role' = 'service_role');
