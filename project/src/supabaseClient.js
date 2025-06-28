import { createClient } from '@supabase/supabase-js';

// Use environment variables from Netlify-Supabase integration, fallback to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://occrvhahkgvvyzvpnsjz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jY3J2aGFoa2d2dnl6dnBuc2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTE4ODQsImV4cCI6MjA2NDQyNzg4NH0.IGaqd4lLbOzM5NPKVbzVBQgOMB1K0Yb10I1z9z97lR0';

// Debug logging to see which source is being used
console.log('Supabase URL source:', import.meta.env.VITE_SUPABASE_URL ? 'Environment Variable' : 'Hardcoded');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration!');
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
