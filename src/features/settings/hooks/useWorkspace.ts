import { useContext } from "react";
import { WorkspaceContext } from "../WorkspaceProvider";
import type { WorkspaceContextValue } from "../types/workspace.types";

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useWorkspace doit être utilisé à l'intérieur d'un WorkspaceProvider"
    );
  }
  return context;
}
