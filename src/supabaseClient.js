import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your Supabase project values.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// We authenticate with mobile number + password. Supabase Auth's built-in
// identity types are email and verified phone (which requires an SMS
// provider like Twilio/MSG91 configured in the Supabase dashboard). Until
// that's wired up we use a documented workaround: turn the phone number
// into a stable pseudo-email so Supabase's email/password auth can be used
// as-is. See README.md for how to switch to real phone OTP later.
export function phoneToPseudoEmail(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return `${digits}@holasangathi.app`;
}
