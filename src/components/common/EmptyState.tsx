interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => (
  <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 text-center" role="status">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
      <svg
        className="h-7 w-7 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        />
      </svg>
    </div>
    <h3 className="mb-1 text-base font-semibold text-gray-800 dark:text-white/90">
      {title}
    </h3>
    <p className="mb-5 max-w-xs text-sm text-gray-500 dark:text-gray-400">
      {description}
    </p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
