import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  userId: string | null;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Hook for managing Supabase authentication with anonymous auth support.
 * 
 * Security: Uses server-validated auth.uid() instead of client-generated UUIDs.
 * When a user performs a write operation (bookmarks, progress), we auto-sign them in anonymously.
 * This creates a real authenticated session that can be validated server-side via RLS policies.
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        isLoading: false,
        isAuthenticated: !!session?.user,
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Sign in anonymously - creates a real authenticated user
   * that can be validated server-side. The user's data persists
   * until they clear browser storage or the anonymous session expires.
   */
  const signInAnonymously = useCallback(async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('Anonymous sign-in failed:', error);
      throw error;
    }

    // Session will be updated via onAuthStateChange
    return;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }, []);

  return {
    ...state,
    userId: state.user?.id ?? null,
    signInAnonymously,
    signOut,
  };
}

/**
 * Hook that ensures the user is authenticated before allowing write operations.
 * Auto-signs in anonymously if not authenticated.
 */
export function useAuthenticatedAction() {
  const auth = useAuth();

  const executeWithAuth = useCallback(async <T>(
    action: (userId: string) => Promise<T>
  ): Promise<T | null> => {
    let userId = auth.userId;

    // If not authenticated, sign in anonymously first
    if (!userId) {
      try {
        await auth.signInAnonymously();
        // Wait a moment for auth state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get the new session
        const { data: { session } } = await supabase.auth.getSession();
        userId = session?.user?.id ?? null;
        
        if (!userId) {
          console.error('Failed to get user ID after anonymous sign-in');
          return null;
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        return null;
      }
    }

    return action(userId);
  }, [auth]);

  return { executeWithAuth, ...auth };
}
