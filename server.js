const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/api/check-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ exists: false, error: 'No email provided' });

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ email });
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ exists: false, error: error.message });
    }
    const exists = data.users && data.users.length > 0;
    res.status(200).json({ exists });
  } catch (err) {
    console.error('Fetch failed:', err);
    res.status(500).json({ exists: false, error: 'fetch failed' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
