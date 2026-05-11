const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Supabase credentials (SUPABASE_URL / SUPABASE_ANON_KEY) are missing! Check your Vercel Environment Variables.');
}

// Ensure we don't crash on init, but throw clear error on use
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

module.exports = supabase;
