import { Transaction } from "@/types/transaction";
import { formatAmount, formatDate } from "@/utils/formatting";

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  return (
    <tr
      key={transaction.id}
      className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
    >
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
        {formatDate(transaction.date)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            transaction.type === "inflow"
              ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
          }`}
        >
          {transaction.type === "inflow" ? "Inflow" : "Outflow"}
        </span>
      </td>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">
        {formatAmount(transaction.amount, transaction.type)}
      </td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
        {transaction.category || "—"}
      </td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
        {transaction.description || "—"}
      </td>
    </tr>
  );
}
