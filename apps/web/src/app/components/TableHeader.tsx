"use client";

import { SortDownIcon, SortUpIcon, UnsortedIcon } from "./icons";
import { DEFAULT_CURRENCY } from "../../utils/constants";
import { SortField, SortOrder } from "@/types/transaction";

interface TableHeaderProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

// Icon component is not exported as it is only used within TableHeader
function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField;
  sortField: SortField;
  sortOrder: SortOrder;
}) {
  if (sortField !== field) {
    return (
      <span className="text-zinc-400 dark:text-zinc-600">
        <UnsortedIcon />
      </span>
    );
  }
  return (
    <span className="text-zinc-900 dark:text-zinc-100">
      {sortOrder === "asc" ? <SortUpIcon /> : <SortDownIcon />}
    </span>
  );
}

export function TableHeader({
  sortField,
  sortOrder,
  onSort,
}: TableHeaderProps) {
  const headerClass =
    "cursor-pointer px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800";

  const headers: { field: SortField; label: string; width?: string }[] = [
    { field: "date", label: "Date", width: "w-36" },
    { field: "type", label: "Type" },
    { field: "amount", label: `Amount (${DEFAULT_CURRENCY})` },
    { field: "category", label: "Category" },
    { field: "description", label: "Description" },
  ];

  return (
    <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <tr>
        {headers.map(({ field, label, width }) => (
          <th
            key={field}
            className={`${headerClass} ${width || ""}`}
            onClick={() => onSort(field)}
          >
            <div className="flex items-center gap-2">
              {label}
              <SortIcon
                field={field}
                sortField={sortField}
                sortOrder={sortOrder}
              />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
