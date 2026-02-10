import React from "react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-amber-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]} ${getColor(name)}
        rounded-full flex items-center justify-center text-white font-medium
        ${className}
      `}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
