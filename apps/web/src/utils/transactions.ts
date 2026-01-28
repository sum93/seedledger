import { SortField, SortOrder, Transaction } from "@/types/transaction";

export function sortTransactions(
  transactions: Transaction[],
  sortField: SortField,
  sortOrder: SortOrder,
): Transaction[] {
  return [...transactions].sort((a, b) => {
    let aValue: string | number | Date = a[sortField] ?? "";
    let bValue: string | number | Date = b[sortField] ?? "";

    if (sortField === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}
