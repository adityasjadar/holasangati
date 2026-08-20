import { supabase } from '../lib/supabaseClient';

export async function getReviewsForUser(userId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('reviewed_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// contactRequestId MUST reference an accepted contact_requests row between
// the reviewer and reviewedUserId — the reviews_insert RLS policy enforces
// this at the database level, so a review is structurally impossible
// without a real prior interaction.
export async function submitReview({ reviewerId, reviewedUserId, contactRequestId, rating, review }) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({ reviewer_id: reviewerId, reviewed_user_id: reviewedUserId, contact_request_id: contactRequestId, rating, review })
    .select()
    .single();
  if (error) throw error;
  return data;
}
