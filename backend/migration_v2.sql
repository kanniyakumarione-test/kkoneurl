ALTER TABLE users ADD COLUMN IF NOT EXISTS username_last_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"emailNotifs": true, "publicProfile": true}'::jsonb;
