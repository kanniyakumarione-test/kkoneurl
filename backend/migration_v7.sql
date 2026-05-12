-- Migration V7: Admin role support
ALTER TABLE users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set primary admin account
UPDATE users
SET is_admin = true
WHERE lower(email) = 'aigenerator2k@gmail.com';
