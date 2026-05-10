import type { ReactNode } from "react";
import Skeleton from "./Skeleton";

interface ResponsiveTableProps {
  title?: string;
  description?: string;
  children: ReactNode;
  emptyState?: ReactNode;
  isLoading?: boolean;
}

const ResponsiveTable = ({
  title,
  description,
  children,
  emptyState,
  isLoading,
}: ResponsiveTableProps) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
    {(title || description) && (
      <div className="border-b border-gray-100 px-5 py-4 dark:border-white/[0.05]">
        {title && (
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    )}
    <div className="max-w-full overflow-x-auto">
      {isLoading ? (
        <div className="space-y-3 p-5" aria-label="Chargement des données">
          <Skeleton variant="line" />
          <Skeleton variant="line" className="w-3/4" />
          <Skeleton variant="line" className="w-1/2" />
        </div>
      ) : emptyState ? (
        <div className="p-5">{emptyState}</div>
      ) : (
        <div className="min-w-[600px]">{children}</div>
      )}
    </div>
  </div>
);

export default ResponsiveTable;
