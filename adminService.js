import { supabase } from '../lib/supabaseClient';

// Every call here relies on the is_admin() RLS check in schema.sql — a
// non-admin caller gets empty results / a permission error, never data.
export async function adminListProfiles() {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminListMachinery() {
  const { data, error } = await supabase.from('machinery').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminListRequirements() {
  const { data, error } = await supabase.from('requirements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminListReports() {
  const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminSetUserStatus(userId, status) {
  const { error } = await supabase.from('profiles').update({ status }).eq('id', userId);
  if (error) throw error;
}

export async function adminSetMachineryStatus(id, status) {
  const { error } = await supabase.from('machinery').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function adminSetReportStatus(id, status) {
  const { error } = await supabase.from('reports').update({ status }).eq('id', id);
  if (error) throw error;
}
