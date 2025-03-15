-- Recreate the users table after it was dropped
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Disable RLS for users table to allow registration
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Enable realtime for the users table
alter publication supabase_realtime add table users;