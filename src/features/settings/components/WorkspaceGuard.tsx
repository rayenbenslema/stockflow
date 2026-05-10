import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import RouteLoader from "../../../components/common/RouteLoader";

interface WorkspaceGuardProps {
  children: ReactNode;
}

export function WorkspaceGuard({ children }: WorkspaceGuardProps) {
  const { businesses, isLoading } = useWorkspace();

  if (isLoading) return <RouteLoader />;
  if (businesses.length === 0) return <Navigate to="/onboarding/business" replace />;

  return <>{children}</>;
}
