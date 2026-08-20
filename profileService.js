import { supabase } from '../lib/supabaseClient';

export async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, fields) {
  const { data, error } = await supabase.from('profiles').update(fields).eq('id', userId).select().single();
  if (error) throw error;
  return data;
}

export async function updatePhone(userId, phone) {
  const { error } = await supabase.from('profiles_private').update({ phone }).eq('user_id', userId);
  if (error) throw error;
}

export async function setLocation(userId, latitude, longitude) {
  return updateProfile(userId, { latitude, longitude });
}

// Only ever call this after an accepted contact_requests row exists between
// the caller and targetUserId — enforced server-side by the RPC itself.
export async function getContactPhone(targetUserId) {
  const { data, error } = await supabase.rpc('get_contact_phone', { target_user: targetUserId });
  if (error) throw error;
  return data;
}
