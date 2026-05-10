const RouteLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-400" />
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        Chargement…
      </p>
    </div>
  </div>
);

export default RouteLoader;
