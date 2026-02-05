export type TransactionType = "inflow" | "outflow";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  date: string | Date;
  description: string | null;
  category: string | null;
};

export type SortField = "type" | "amount" | "date" | "description" | "category";
export type SortOrder = "asc" | "desc";
