import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../auth/hooks/useAuth";
import {
  getMyBusinesses,
  getCurrentBusinessMemberships,
  createBusinessWithOwner,
} from "./services/business.service";
import type { BusinessRow, BusinessMembershipRow } from "../../types/supabase";
import type { WorkspaceContextValue } from "./types/workspace.types";

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<BusinessRow | null>(null);
  const [memberships, setMemberships] = useState<BusinessMembershipRow[]>([]);
  const [loadingCount, setLoadingCount] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const isLoading = loadingCount > 0;

  const refreshWorkspace = useCallback(async () => {
    if (!user) {
      setBusinesses([]);
      setCurrentBusiness(null);
      setMemberships([]);
      setLoadingCount(0);
      setError(null);
      return;
    }

    setLoadingCount((c) => c + 1);
    setError(null);

    try {
      const [fetchedBusinesses, fetchedMemberships] = await Promise.all([
        getMyBusinesses(),
        getCurrentBusinessMemberships(),
      ]);

      setBusinesses(fetchedBusinesses);
      setMemberships(fetchedMemberships);

      if (fetchedBusinesses.length > 0) {
        setCurrentBusiness(fetchedBusinesses[0]);
      } else {
        setCurrentBusiness(null);
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de l'espace de travail";
      setError(message);
    } finally {
      setLoadingCount((c) => c - 1);
    }
  }, [user]);

  const createBusiness = useCallback(
    async (input: { name: string; legalName?: string; taxIdentifier?: string }) => {
      const businessId = await createBusinessWithOwner(input);
      await refreshWorkspace();
      return businessId;
    },
    [refreshWorkspace]
  );

  useEffect(() => {
    refreshWorkspace();
  }, [refreshWorkspace]);

  return (
    <WorkspaceContext.Provider
      value={{
        businesses,
        currentBusiness,
        memberships,
        isLoading,
        error,
        refreshWorkspace,
        createBusiness,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
