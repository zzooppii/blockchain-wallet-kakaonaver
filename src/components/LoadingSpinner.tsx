"use client";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-[3px]",
};

export default function LoadingSpinner({ size = "md", className = "" }: Props) {
  return (
    <div
      className={`${sizes[size]} rounded-full border-zinc-200 border-t-zinc-700 dark:border-zinc-700 dark:border-t-zinc-300 animate-spin ${className}`}
    />
  );
}
