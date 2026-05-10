import type { User, Session } from "@supabase/supabase-js";
import type { ProfileRow } from "../../../types/supabase";

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: ProfileRow | null;
  profileError: string | null;
  isLoading: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export type AuthContextValue = AuthState & AuthActions;
