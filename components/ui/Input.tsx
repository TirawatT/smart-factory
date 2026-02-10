import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full px-3 py-2 text-sm rounded-[var(--radius-sm)]
            border border-input bg-card text-foreground
            placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? "pl-10" : ""}
            ${error ? "border-danger focus:ring-danger/50" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
