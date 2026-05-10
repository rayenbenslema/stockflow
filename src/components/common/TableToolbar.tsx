import type { ReactNode } from "react";

interface TableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
}

const TableToolbar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher…",
  filters,
  actions,
}: TableToolbarProps) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <label htmlFor="table-search" className="sr-only">
          {searchPlaceholder}
        </label>
        <input
          id="table-search"
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-400"
        />
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      {filters && <div className="flex items-center gap-2">{filters}</div>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default TableToolbar;
