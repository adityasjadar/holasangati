import { supabase } from '../lib/supabaseClient';

export async function searchOpenRequirements({ district, taluk, requirementType } = {}) {
  let query = supabase.from('requirements').select('*').eq('status', 'open');
  if (district && district !== 'all') query = query.eq('district', district);
  if (taluk) query = query.eq('taluk', taluk);
  if (requirementType && requirementType !== 'all') query = query.eq('requirement_type', requirementType);
  query = query.order('created_at', { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getMyRequirements(farmerId) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('farmer_id', farmerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function postRequirement(farmerId, fields) {
  const { data, error } = await supabase.from('requirements').insert({ farmer_id: farmerId, ...fields }).select().single();
  if (error) throw error;
  return data;
}

export async function updateRequirementStatus(id, status) {
  const { data, error } = await supabase.from('requirements').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteRequirement(id) {
  const { error } = await supabase.from('requirements').delete().eq('id', id);
  if (error) throw error;
}
