import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://occrvhahkgvvyzvpnsjz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jY3J2aGFoa2d2dnl6dnBuc2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTE4ODQsImV4cCI6MjA2NDQyNzg4NH0.IGaqd4lLbOzM5NPKVbzVBQgOMB1K0Yb10I1z9z97lR0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
