import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.https://isprxfptcjwxsemzwrdu.supabase.co as string,
  process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcHJ4ZnB0Y2p3eHNlbXp3cmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTUwMDcsImV4cCI6MjA2OTQ5MTAwN30.3es8Yf_rWuO5xt7Ldw9GqIRyb4_wLhho2Cuu5cgzNIE as string
);
