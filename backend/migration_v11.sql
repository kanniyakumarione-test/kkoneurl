-- Migration v11: Add custom design and bio fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_bg TEXT DEFAULT 'linear-gradient(135deg, #1a1a2e, #16213e)';
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_accent TEXT DEFAULT '#6c63ff';
ALTER TABLE users ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS embeds JSONB DEFAULT '[]'::jsonb;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
