import { createAuthenticatedFetch } from '@consulting19/shared';

/**
 * Fetches client data using the backend API
 * The API automatically filters by profile_id for client users
 */
export const fetchClientDataByProfileId = async (profileId: string) => {
  if (!profileId) {
    throw new Error('Profile ID is required');
  }

  console.log('🔍 DEBUG: Fetching client data for profile_id:', profileId);
  
  const authFetch = createAuthenticatedFetch();
  
  try {
    const response = await authFetch('/api/clients', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch client data: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.clients || data.clients.length === 0) {
      throw new Error(`Client data not found for profile: ${profileId}`);
    }

    const clientData = data.clients[0];
    console.log('🔍 DEBUG: Found client:', clientData);
    return clientData;
  } catch (error) {
    console.error('❌ DEBUG: Client fetch error:', error);
    throw new Error(`Client data not found for profile: ${profileId}`);
  }
};