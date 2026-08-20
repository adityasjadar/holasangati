import { supabase, phoneToPseudoEmail } from '../lib/supabaseClient';

// Registers a new user: creates the Supabase Auth identity, then the public
// profile row, then (for workers/owners) the role-specific row. If any step
// after auth signup fails we surface the error — the caller should show it
// via MESSAGES.genericError and the user can retry (auth signup itself is
// idempotent-ish: Supabase will error "already registered" on repeat).
export async function registerUser({ fullName, phone, password, district, taluk, village, role, preferredLanguage }) {
  const email = phoneToPseudoEmail(phone);

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
  if (signUpError) throw signUpError;

  const userId = signUpData.user?.id;
  if (!userId) throw new Error('Sign up did not return a user id.');

  const { error: profileError } = await supabase.from('profiles').insert({
    id: userId,
    role,
    full_name: fullName,
    district,
    taluk,
    village,
    preferred_language: preferredLanguage,
  });
  if (profileError) throw profileError;

  const { error: privateError } = await supabase.from('profiles_private').insert({
    user_id: userId,
    phone,
  });
  if (privateError) throw privateError;

  if (role === 'worker') {
    const { error } = await supabase.from('worker_profiles').insert({ user_id: userId, work_types: [], workers_available: 1 });
    if (error) throw error;
  }

  return signUpData;
}

export async function loginUser({ phone, password }) {
  const email = phoneToPseudoEmail(phone);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Requires the user to already be logged in (Supabase's password-recovery
// email flow needs a real email address, which we don't collect — so
// "forgot password" for phone-based accounts is a known MVP gap; this
// covers the "change password while logged in" case from a profile page).
export async function changePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function deleteOwnAccount(userId) {
  // Deleting the auth.users row requires the service_role key, which must
  // never live in frontend code. So account deletion here removes the
  // user's own data via RLS-protected deletes and signs them out; the
  // auth.users row itself should be removed by an admin (or a server-side
  // edge function using the service role) — see README "Delete account".
  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.auth.signOut();
}
