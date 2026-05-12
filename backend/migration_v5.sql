-- Migration V5: Advanced Redirects and Stats
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS geo_redirects JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS device_routing JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS unique_clicks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS country_stats JSONB DEFAULT '{}'::jsonb;

-- User Profile Enhancements
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS embeds JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS newsletter_settings JSONB DEFAULT '{"enabled": false, "title": "Join my newsletter"}'::jsonb,
ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE;

ALTER TABLE links
ADD COLUMN IF NOT EXISTS ab_test JSONB DEFAULT '{"enabled": false, "url_b": "", "split": 50}'::jsonb;

-- Link Bundles
CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6c63ff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE links 
ADD COLUMN IF NOT EXISTS bundle_id UUID REFERENCES bundles(id) ON DELETE SET NULL;

ALTER TABLE links
ADD COLUMN IF NOT EXISTS og_tags JSONB DEFAULT '{"title": "", "description": "", "image": ""}'::jsonb;

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(owner_id, email)
);
