import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key, only on server!
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email) return res.status(400).json({ exists: false, error: 'No email provided' });

  // Use the Supabase Admin API to list users by email
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ email });
  if (error) return res.status(500).json({ exists: false, error: error.message });

  const exists = data.users && data.users.length > 0;
  res.status(200).json({ exists });
}
