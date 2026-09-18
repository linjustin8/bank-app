import { useAccountData } from "~/hooks/use-account-data"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"

import { formatCurrency, formatDate } from "~/lib/account-data"

export function meta() {
  return [{ title: "Transactions · G3 Banking" }]
}

/**
 * Transaction history, and the table view for the account page's charts —
 * every plotted value is readable here without relying on colour or hover.
 */
export default function Transactions() {
  const { account, transactions, monthlyFlow, message, accountLink } =
    useAccountData()
  if (!account || !transactions) return <p role="status">{message}</p>
  return (
    <div className="space-y-6">
      <header>
        <Link
          to={accountLink("/account_details")}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Back to account
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-foreground">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-secondary-foreground">
          Account #{account.id} · {transactions.length} total
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Transactions for account {account.id}, newest first
          </caption>
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">
                Date
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Description
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-3">
                  No transactions yet.
                </td>
              </tr>
            )}
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="px-4 py-3 whitespace-nowrap text-secondary-foreground tabular-nums">
                  {formatDate(txn.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {txn.category}
                </td>
                <td className="px-4 py-3 text-secondary-foreground">
                  {txn.type === "DEPOSIT" ? "Deposit" : "Withdrawal"}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                  {txn.type === "DEPOSIT" ? "+" : "−"}
                  {formatCurrency(txn.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <h2 className="border-b px-4 py-3 text-sm font-semibold text-foreground">
          Monthly totals
        </h2>
        <table className="w-full text-sm">
          <caption className="sr-only">
            Deposits and withdrawals per month — the table view of the deposits
            vs withdrawals chart
          </caption>
          <thead>
            <tr className="border-b text-left text-xs text-muted-foreground">
              <th scope="col" className="px-4 py-3 font-medium">
                Month
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Deposits
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Withdrawals
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Closing balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {monthlyFlow.map((row) => (
              <tr key={row.month}>
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-foreground"
                >
                  {row.month}
                </th>
                <td className="px-4 py-3 text-right text-secondary-foreground tabular-nums">
                  {formatCurrency(row.deposits)}
                </td>
                <td className="px-4 py-3 text-right text-secondary-foreground tabular-nums">
                  {formatCurrency(row.withdrawals)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                  {formatCurrency(row.closingBalance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
