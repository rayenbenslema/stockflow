import { supabase } from "../../../services/supabase";
import type { ProfileRow } from "../../../types/supabase";

export interface ProfileUpdateInput {
  full_name?: string;
  avatar_url?: string;
}

export async function getCurrentProfile(): Promise<ProfileRow | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}

export async function updateOwnProfile(input: ProfileUpdateInput): Promise<ProfileRow> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Aucun utilisateur connecté");

  const { data, error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
