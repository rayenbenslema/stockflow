import { supabase } from "../../../services/supabase";
import type { BusinessRow, BusinessMembershipRow } from "../../../types/supabase";

export interface CreateBusinessInput {
  name: string;
  legalName?: string;
  taxIdentifier?: string;
}

export async function getMyBusinesses(): Promise<BusinessRow[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createBusinessWithOwner(
  input: CreateBusinessInput
): Promise<string> {
  const { data, error } = await supabase.rpc("create_business_with_owner", {
    p_name: input.name,
    p_legal_name: input.legalName ?? null,
    p_tax_identifier: input.taxIdentifier ?? null,
  });

  if (error) throw error;
  return data as string;
}

export async function getCurrentBusinessMemberships(): Promise<BusinessMembershipRow[]> {
  const { data, error } = await supabase
    .from("business_memberships")
    .select("*");

  if (error) throw error;
  return data ?? [];
}
