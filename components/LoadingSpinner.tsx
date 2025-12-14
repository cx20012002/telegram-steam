import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
  showMessage?: boolean;
}

const LoadingSpinner = ({
  size = "md",
  message,
  className,
  showMessage = true,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2",
  };

  const containerPadding = {
    sm: "min-h-[60px]",
    md: "min-h-[80px]",
    lg: "min-h-[100px]",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        containerPadding[size],
        className
      )}
    >
      <div
        className={cn(
          "border-muted-foreground/20 border-t-primary rounded-full animate-spin",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {showMessage && (
        <p className="text-sm text-muted-foreground mt-3 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
