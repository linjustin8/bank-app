import { useAccountData } from "~/hooks/use-account-data"
import { ArrowDownToLine, ArrowRight, ArrowUpFromLine, Receipt, TrendingUp } from "lucide-react"
import { Link } from "react-router"

import { FlowSplit } from "~/components/account/flow-split"
import { StatTile } from "~/components/account/stat-tile"
import { Sparkline } from "~/components/charts/sparkline"
import { buttonVariants } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { formatCurrency, formatDate, summarize, currentMonthTransactions } from "~/lib/account-data"

// Buttons to respective pages
const ACTIONS = [
  {
    to: "/deposit",
    label: "Deposit",
    icon: ArrowDownToLine,
    variant: "default" as const,
  },
  {
    to: "/withdraw",
    label: "Withdraw",
    icon: ArrowUpFromLine,
    variant: "outline" as const,
  },
  {
    to: "/transactions",
    label: "View transactions",
    icon: Receipt,
    variant: "outline" as const,
  },
]

// Available balance - Top left card
export default function AccountDetails() {
  const {account, accounts, transactions, monthlyFlow, message, accountLink, selectAccount } = useAccountData()
  if (!account || !transactions) return <p role="status">{message}</p>
  const thisMonth = currentMonthTransactions(transactions)
  const summary = summarize(thisMonth)
  const categorySplit = [
    {
      key: "deposits",
      label: "Deposits",
      flow: "In",
      value: summary.deposits,
      colorVar: "var(--viz-1)",
    },
    {
      key: "withdrawals",
      label: "Withdrawals",
      flow: "Out",
      value: summary.withdrawals,
      colorVar: "var(--viz-2)",
    },
  ]

  const balanceTrend = monthlyFlow.map((row) => row.closingBalance)
  const previousBalance = balanceTrend[balanceTrend.length - 2] ?? 0
  const balanceChange = account.balance - previousBalance
  const balanceChangePct =
    previousBalance === 0 ? null : (balanceChange / previousBalance) * 100

  return (
    <div className="space-y-6">
      {accounts && accounts.length > 1 && (
        <label className="block text-sm">
          Account
          <select
            className="ml-2 rounded border p-2"
            value={account.id}
            onChange={(event) => selectAccount(event.target.value)}
          >
            {accounts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.accountType} #{item.id}
              </option>
            ))}
          </select>
        </label>
      )}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-wide text-secondary-foreground uppercase">
            Account details
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            {account.userName}
          </h1>
          <dl className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <div className="flex items-center gap-1.5">
              <dt className="text-secondary-foreground">Account ID</dt>
              <dd className="font-medium text-foreground tabular-nums">
                #{account.id}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="text-secondary-foreground">Type</dt>
              <dd className="font-medium text-foreground">
                {titleCase(account.accountType)}
              </dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="text-secondary-foreground">User ID</dt>
              <dd className="font-medium text-foreground tabular-nums">
                {account.userId}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Balance card — top right */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <h2 className="text-xs text-muted-foreground">
                Available balance
              </h2>
              <p className="mt-1 text-5xl font-semibold text-foreground">
                {formatCurrency(account.balance)}
              </p>
              <p
                className="mt-2 flex items-center gap-1.5 text-sm"
                style={{
                  color:
                    balanceChange >= 0 ? "var(--viz-good)" : "var(--viz-critical)",
                }}
              >
                <TrendingUp className="size-4" aria-hidden />
                {balanceChange >= 0 ? "+" : "−"}
                {formatCurrency(Math.abs(balanceChange))} vs last month
              </p>
            </div>

            <div className="w-full max-w-[220px]">
              <p className="mb-1.5 text-xs text-muted-foreground">
                Balance, last 6 months
              </p>
              <Sparkline values={balanceTrend} className="h-12 w-full" />
            </div>
          </div>

          <nav
            aria-label="Account actions"
            className="mt-6 flex flex-wrap gap-2 border-t pt-5"
          >
            {ACTIONS.map((action) => (
              <Link
                key={action.to}
                to={accountLink(action.to)}
                className={cn(
                  buttonVariants({ variant: action.variant, size: "lg" }),
                  "px-4"
                )}
              >
                <action.icon aria-hidden />
                {action.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Top left card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">
            This month at a glance
          </h2>
          <p className="mt-0.5 mb-5 text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <FlowSplit
            deposits={summary.deposits}
            withdrawals={summary.withdrawals}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Across {summary.transactionCount} transactions made this month
          </p>
        </div>
      </section>

        {/* Middle row of cards. Summary of actions made during current month */}
      <section
        aria-label="Monthly summary"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatTile
          label="Deposits this month"
          value={formatCurrency(summary.deposits)}
          colorVar="var(--viz-1)"
        />
        <StatTile
          label="Withdrawals this month"
          value={formatCurrency(summary.withdrawals)}
          colorVar="var(--viz-2)"
        />
        <StatTile
          label="Net flow"
          value={`${summary.netFlow >= 0 ? "+" : "−"}${formatCurrency(Math.abs(summary.netFlow))}`}
          delta={
            summary.deposits > 0 ? `${Math.round(summary.spendRate * 100)}% of income spent` : "No deposits this month"
          }
          deltaIsGood={summary.spendRate < 1}
        />
        <StatTile
          label="Transactions this month"
          value={String(summary.transactionCount)}
          delta={
            thisMonth[0]
              ? `Latest ${formatDate(thisMonth[0].createdAt)}`
              : "No transactions this month"
          }
          deltaIsGood
        />
      </section>

        {/* Bottom Card - displays the 5 most recent transactions made */}
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-foreground">
            Recent activity
          </h2>
          <Link
            to={accountLink("/transactions")}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        {transactions.length === 0 && (
          <p className="text-sm text-muted-foreground">No transactions yet.</p>
        )}
        <ul className="divide-y">
            {/* 5 most recent transactions */}
          {transactions.slice(0, 5).map((txn) => {
            const isDeposit = txn.type === "DEPOSIT"
            return (
              <li
                key={txn.id}
                className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: isDeposit
                      ? "color-mix(in oklch, var(--viz-1) 12%, transparent)"
                      : "color-mix(in oklch, var(--viz-2) 12%, transparent)",
                    color: isDeposit ? "var(--viz-1)" : "var(--viz-2)",
                  }}
                >
                  {isDeposit ? (
                    <ArrowDownToLine className="size-4" />
                  ) : (
                    <ArrowUpFromLine className="size-4" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {txn.category}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {titleCase(txn.type)} · {formatDate(txn.createdAt)}
                  </p>
                </div>

                <p className="text-sm font-medium text-foreground tabular-nums">
                  {isDeposit ? "+" : "−"}
                  {formatCurrency(txn.amount)}
                </p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}

function titleCase(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase()
}
