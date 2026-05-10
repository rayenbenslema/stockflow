import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase";
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
} from "./services/auth.service";
import { getCurrentProfile } from "./services/profile.service";
import type { ProfileRow } from "../../types/supabase";
import type { AuthContextValue } from "./types/auth.types";

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      setProfileError(null);
      const currentProfile = await getCurrentProfile();
      setProfile(currentProfile);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du chargement du profil";
      setProfileError(message);
    }
  }, []);

  const handleSessionChange = useCallback(async (currentSession: Session | null) => {
    setSession(currentSession);
    setUser(currentSession?.user ?? null);

    if (currentSession?.user) {
      await refreshProfile();
    } else {
      setProfile(null);
      setProfileError(null);
    }

    setIsLoading(false);
  }, [refreshProfile]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      handleSessionChange(currentSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      handleSessionChange(currentSession);
    });

    return () => subscription.unsubscribe();
  }, [handleSessionChange]);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result.error) return { error: result.error };
    return {};
  };

  const signUp = async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    if (result.error) return { error: result.error };
    return {};
  };

  const signOut = async () => {
    await signOutUser();
    setUser(null);
    setSession(null);
    setProfile(null);
    setProfileError(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, profileError, isLoading, signIn, signUp, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
