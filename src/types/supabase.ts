export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BusinessRole =
  | "owner"
  | "manager"
  | "cashier"
  | "analyst"
  | "accountant";

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessRow {
  id: string;
  name: string;
  legal_name: string | null;
  tax_identifier: string | null;
  country: string;
  currency: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BusinessMembershipRow {
  id: string;
  business_id: string;
  user_id: string;
  role: BusinessRole;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  business_id: string | null;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Json;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at">;
        Update: Partial<Omit<ProfileRow, "id">>;
      };
      businesses: {
        Row: BusinessRow;
        Insert: Omit<BusinessRow, "id" | "created_at" | "updated_at" | "deleted_at">;
        Update: Partial<Omit<BusinessRow, "id">>;
      };
      business_memberships: {
        Row: BusinessMembershipRow;
        Insert: Omit<BusinessMembershipRow, "id" | "created_at">;
        Update: Partial<Omit<BusinessMembershipRow, "id">>;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Omit<AuditLogRow, "id" | "created_at">;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      create_business_with_owner: {
        Args: {
          p_name: string;
          p_legal_name?: string;
          p_tax_identifier?: string;
        };
        Returns: string;
      };
      is_business_member: {
        Args: { p_business_id: string };
        Returns: boolean;
      };
      has_business_role: {
        Args: { p_business_id: string; p_roles: BusinessRole[] };
        Returns: boolean;
      };
    };
    Enums: {
      business_role: BusinessRole;
    };
  };
}
