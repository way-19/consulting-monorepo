import { supabase } from '../lib/supabase';

/**
 * Force clear all session data and reset authentication state
 * This is useful when there's a mismatch between cached session and backend data
 */
export async function forceResetSession(): Promise<void> {
  try {
    console.log('🧹 Forcing session reset...');
    
    // 1. Sign out from all sessions globally
    await supabase.auth.signOut({ scope: 'global' });
    
    // 2. Clear all Supabase-related localStorage data
    if (typeof window !== 'undefined' && window.localStorage) {
      const keysToRemove: string[] = [];
      
      // Find all keys that contain supabase or auth-related data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.includes('supabase') || 
          key.includes('auth') ||
          key.includes('sb-') ||
          key.startsWith('supabase.auth.token')
        )) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all found keys
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Cleared localStorage key: ${key}`);
      });
      
      console.log(`✅ Cleared ${keysToRemove.length} cached session keys`);
    }
    
    // 3. Clear sessionStorage as well
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (
          key.includes('supabase') || 
          key.includes('auth') ||
          key.includes('sb-')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
      });
      
      if (keysToRemove.length > 0) {
        console.log(`✅ Cleared ${keysToRemove.length} sessionStorage keys`);
      }
    }
    
    // 4. Force refresh the auth state
    await supabase.auth.refreshSession();
    
    console.log('✅ Session reset completed');
    
  } catch (error) {
    console.error('❌ Error during session reset:', error);
    throw error;
  }
}

/**
 * Check if there's a session mismatch that requires reset
 * Returns true if the current session user ID doesn't match the expected pattern
 */
export async function checkSessionMismatch(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false; // No session, no mismatch
    }
    
    // Check if this is the problematic old user ID
    const problematicUserId = 'd3e11540-bd33-4d45-a883-d7cd398b48ae';
    
    if (session.user.id === problematicUserId) {
      console.warn('⚠️ Detected problematic cached session with old user ID');
      return true;
    }
    
    // Try to fetch the user profile to see if it exists
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();
    
    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist for this user ID
      console.warn('⚠️ Session user ID has no corresponding profile');
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error('Error checking session mismatch:', error);
    return false;
  }
}

/**
 * Auto-reset session if mismatch is detected
 * This should be called on app initialization
 */
export async function autoResetIfNeeded(): Promise<void> {
  const needsReset = await checkSessionMismatch();
  
  if (needsReset) {
    console.log('🔄 Auto-resetting session due to detected mismatch...');
    await forceResetSession();
    
    // Reload the page to ensure clean state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}