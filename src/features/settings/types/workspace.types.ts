import type { BusinessRow, BusinessMembershipRow } from "../../../types/supabase";

export interface WorkspaceState {
  businesses: BusinessRow[];
  currentBusiness: BusinessRow | null;
  memberships: BusinessMembershipRow[];
  isLoading: boolean;
  error: string | null;
}

export interface WorkspaceActions {
  refreshWorkspace: () => Promise<void>;
  createBusiness: (input: { name: string; legalName?: string; taxIdentifier?: string }) => Promise<string>;
}

export type WorkspaceContextValue = WorkspaceState & WorkspaceActions;
