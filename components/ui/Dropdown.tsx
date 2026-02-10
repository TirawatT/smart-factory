"use client";

import React, { useState, useRef, useEffect } from "react";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`
          absolute top-full mt-1 z-50 min-w-[180px]
          bg-card border border-border rounded-[var(--radius)] shadow-lg
          py-1 animate-fade-in
          ${align === "right" ? "right-0" : "left-0"}
        `}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1 border-t border-border" />
            ) : (
              <button
                key={i}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors cursor-pointer
                  ${
                    item.danger
                      ? "text-danger hover:bg-danger-light"
                      : "text-foreground hover:bg-muted"
                  }
                `}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
