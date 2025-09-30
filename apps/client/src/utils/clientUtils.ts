import { supabase } from '@consulting19/shared/lib/supabase';

/**
 * Fetches client data using the profile_id directly
 * This avoids RLS permission issues with user_profiles table
 */
export const fetchClientDataByProfileId = async (profileId: string) => {
  if (!profileId) {
    throw new Error('Profile ID is required');
  }

  console.log('🔍 DEBUG: Querying clients table with profile_id:', profileId);
  
  // Get client data using profile_id directly
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', profileId)
    .single();

  if (clientError) {
    console.error('❌ DEBUG: Client query error:', clientError);
    console.error('❌ DEBUG: Error details:', JSON.stringify(clientError, null, 2));
    throw new Error(`Client data not found for profile: ${profileId}`);
  }

  console.log('🔍 DEBUG: Found client:', clientData);
  return clientData;
};