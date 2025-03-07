import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    primary: "border-primary",
    secondary: "border-secondary",
    white: "border-white",
  };

  return (
    <div className="relative flex justify-center items-center">
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-4
          border-t-transparent
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
