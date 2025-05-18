// /api/saveMood.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using Vercel environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  const { moodText, genre } = req.body;

  if (!moodText || !genre) {
    return res.status(400).json({ error: 'Missing moodText or genre' });
  }

  // Insert into the "moods" table in Supabase
  const { data, error } = await supabase
    .from('moods')
    .insert([{ mood_text: moodText, genre }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true, data });
}
