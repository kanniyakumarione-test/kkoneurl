-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  avatar TEXT,
  theme TEXT DEFAULT 'dark-purple',
  bio_links JSONB DEFAULT '[]'::jsonb,
  settings JSONB DEFAULT '{"emailNotifs": true, "publicProfile": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Links Table
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  title TEXT,
  clicks INTEGER DEFAULT 0,
  unique_clicks INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  password TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  geo_stats JSONB DEFAULT '{}'::jsonb,
  device_stats JSONB DEFAULT '{"mobile": 0, "desktop": 0, "tablet": 0}'::jsonb,
  browser_stats JSONB DEFAULT '{}'::jsonb,
  daily_clicks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);
