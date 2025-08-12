
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseEnabled } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import LoadingScreen from '@/components/LoadingScreen';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any, data: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Skip auth initialization if Supabase is not configured
    if (!isSupabaseEnabled) {
      console.log('🔒 Supabase disabled - Authentication features unavailable');
      setIsLoading(false);
      return;
    }

    // Get initial session
    const fetchInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Exception when fetching profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      toast({
        title: "Authentication Disabled",
        description: "Authentication features are not available. The app works without login.",
        variant: "destructive",
      });
      return { error: new Error("Authentication disabled") };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Successfully signed in",
        description: "Welcome back!",
      });

      return { error: null };
    } catch (error: any) {
      console.error("Sign in exception:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication service. Please try again later.",
        variant: "destructive",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseEnabled) {
      toast({
        title: "Authentication Disabled",
        description: "Authentication features are not available. The app works without login.",
        variant: "destructive",
      });
      return { error: new Error("Authentication disabled") };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign Up Error",
          description: error.message,
          variant: "destructive",
        });
        return { error, data: null };
      }

      // Check if email confirmation is required
      if (data?.user && data?.user?.identities?.length === 0) {
        toast({
          title: "Email confirmation required",
          description: "Please check your email to confirm your account",
        });
      } else {
        toast({
          title: "Account created successfully",
          description: "Welcome to Glow24 Organics!",
        });
      }

      return { error: null, data };
    } catch (error: any) {
      console.error("Sign up exception:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication service. Please try again later.",
        variant: "destructive",
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
