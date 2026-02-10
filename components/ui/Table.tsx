"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  sortKey,
  sortDirection = "asc",
  onSort,
  emptyMessage = "No data found",
  onRowClick,
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`
                  px-4 py-3 text-left font-medium text-muted-foreground
                  ${col.sortable ? "cursor-pointer select-none hover:text-foreground" : ""}
                  ${col.className || ""}
                `}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable &&
                    sortKey === col.key &&
                    (sortDirection === "asc" ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row) : i}
                className={`
                  border-b border-border last:border-0
                  ${onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  transition-colors
                `}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 ${col.className || ""}`}
                  >
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  total,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {total !== undefined && `${total} results \u00B7 `}
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-1">
        <button
          className="px-3 py-1 text-sm rounded-[var(--radius-sm)] border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 text-sm rounded-[var(--radius-sm)] border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
