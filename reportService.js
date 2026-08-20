import { supabase } from '../lib/supabaseClient';

export async function submitReport({ reporterId, reportedUserId, reason, description }) {
  const { data, error } = await supabase
    .from('reports')
    .insert({ reporter_id: reporterId, reported_user_id: reportedUserId, reason, description })
    .select()
    .single();
  if (error) throw error;
  return data;
}
