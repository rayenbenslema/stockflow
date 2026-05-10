interface SkeletonProps {
  variant?: "line" | "card" | "circle";
  className?: string;
}

const Skeleton = ({ variant = "line", className = "" }: SkeletonProps) => {
  const base = "animate-pulse bg-gray-200 dark:bg-gray-700";

  const variants: Record<string, string> = {
    line: "h-4 w-full rounded",
    card: "h-40 w-full rounded-2xl",
    circle: "h-12 w-12 rounded-full",
  };

  return <div className={`${base} ${variants[variant]} ${className}`} />;
};

export default Skeleton;
