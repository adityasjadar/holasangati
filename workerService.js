import { supabase } from '../lib/supabaseClient';

export async function searchWorkers({ district, taluk, workType, minWorkers } = {}) {
  let query = supabase
    .from('worker_profiles')
    .select('*, profile:profiles!worker_profiles_user_id_fkey(id, full_name, district, taluk, village, latitude, longitude)')
    .eq('is_active', true);

  if (workType && workType !== 'all') query = query.contains('work_types', [workType]);
  if (minWorkers) query = query.gte('workers_available', minWorkers);

  const { data, error } = await query;
  if (error) throw error;

  // district/taluk live on the joined profile row, filter client-side after join
  let rows = data ?? [];
  if (district && district !== 'all') rows = rows.filter((r) => r.profile?.district === district);
  if (taluk) rows = rows.filter((r) => r.profile?.taluk === taluk);
  return rows;
}

export async function getMyWorkerProfile(userId) {
  const { data, error } = await supabase.from('worker_profiles').select('*').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertMyWorkerProfile(userId, fields) {
  const { data, error } = await supabase
    .from('worker_profiles')
    .upsert({ user_id: userId, ...fields, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setWorkerActive(userId, isActive) {
  return upsertMyWorkerProfile(userId, { is_active: isActive });
}
