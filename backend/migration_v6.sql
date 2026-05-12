-- Migration V6: Username first-change policy
-- Allow users to change auto-generated username once immediately,
-- then enforce 60-day lock for subsequent changes.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS username_customized BOOLEAN DEFAULT false;

-- Backfill: if username looks auto-generated (user_xxxxx), treat as not customized.
-- Otherwise mark as customized so existing intentional usernames keep 60-day policy.
UPDATE users
SET username_customized = CASE
  WHEN username ~ '^user_[a-z0-9]{5}$' THEN false
  ELSE true
END
WHERE username IS NOT NULL;
