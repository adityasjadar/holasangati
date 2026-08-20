import { supabase } from '../lib/supabaseClient';

export async function searchMachinery({ district, taluk, machineType, maxPrice } = {}) {
  let query = supabase.from('machinery').select('*').eq('status', 'active');
  if (district && district !== 'all') query = query.eq('district', district);
  if (taluk) query = query.eq('taluk', taluk);
  if (machineType && machineType !== 'all') query = query.eq('machine_type', machineType);
  if (maxPrice) query = query.lte('price', maxPrice);
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getMachineById(id) {
  const { data, error } = await supabase.from('machinery').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getMyMachinery(ownerId) {
  const { data, error } = await supabase
    .from('machinery')
    .select('*')
    .eq('owner_id', ownerId)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addMachine(ownerId, fields) {
  const { data, error } = await supabase.from('machinery').insert({ owner_id: ownerId, ...fields }).select().single();
  if (error) throw error;
  return data;
}

export async function updateMachine(id, fields) {
  const { data, error } = await supabase.from('machinery').update(fields).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function setMachineStatus(id, status) {
  return updateMachine(id, { status });
}

export async function uploadMachineImage(userId, file) {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('machinery-images').upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('machinery-images').getPublicUrl(path);
  return data.publicUrl;
}
