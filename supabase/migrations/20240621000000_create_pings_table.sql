-- Create a table to track pings to keep the Supabase instance active
CREATE TABLE IF NOT EXISTS _pings (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an initial record
INSERT INTO _pings (created_at) VALUES (NOW());

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_pings_created_at ON _pings (created_at);

-- Create a function to clean up old ping records (keep only the last 100)
CREATE OR REPLACE FUNCTION cleanup_pings()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM _pings
  WHERE id NOT IN (
    SELECT id FROM _pings
    ORDER BY created_at DESC
    LIMIT 100
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to run the cleanup function after each insert
DROP TRIGGER IF EXISTS trigger_cleanup_pings ON _pings;
CREATE TRIGGER trigger_cleanup_pings
AFTER INSERT ON _pings
EXECUTE FUNCTION cleanup_pings(); 