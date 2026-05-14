-- Migration V10: Referral System and Scratch Cards
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS link_limit INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';

-- Also ensure links table has analytics columns
ALTER TABLE links
ADD COLUMN IF NOT EXISTS unique_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS geo_stats JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS recent_ips TEXT[] DEFAULT '{}';

-- Function to generate random alphanumeric string for referral codes
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Update existing users with a referral code if they don't have one
UPDATE users SET referral_code = generate_referral_code() WHERE referral_code IS NULL;

-- Promo Codes Table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  reward_type TEXT NOT NULL DEFAULT 'link_limit',
  reward_value INTEGER NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Who this code was issued to (optional)
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES users(id) ON DELETE SET NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Referral Rewards Tracking
ALTER TABLE users
ADD COLUMN IF NOT EXISTS referral_milestones_claimed INTEGER DEFAULT 0;
