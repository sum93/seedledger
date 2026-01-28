import { DEFAULT_LOCALE } from "./constants";

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatAmount(
  amount: number,
  type?: "inflow" | "outflow",
): string {
  const formatted = new Intl.NumberFormat(DEFAULT_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);

  if (!type) return formatted;

  const sign = type === "inflow" ? "+" : "-";
  return `${sign}${formatted}`;
}
