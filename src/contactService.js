import { supabase } from '../lib/supabaseClient';

export async function sendContactRequest({ fromUser, toUser, listingType, listingId, message }) {
  const { data, error } = await supabase
    .from('contact_requests')
    .insert({ from_user: fromUser, to_user: toUser, listing_type: listingType, listing_id: listingId, message })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function respondToContactRequest(id, status) {
  const { data, error } = await supabase.from('contact_requests').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function getIncomingRequests(userId) {
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .eq('to_user', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getOutgoingRequests(userId) {
  const { data, error } = await supabase
    .from('contact_requests')
    .select('*')
    .eq('from_user', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
