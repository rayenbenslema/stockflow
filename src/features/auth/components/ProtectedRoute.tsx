import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import RouteLoader from "../../../components/common/RouteLoader";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <RouteLoader />;
  if (!user) return <Navigate to="/signin" replace />;

  return <>{children}</>;
}
