export type AccountType = "SAVINGS" | "CHECKING"
export type TransactionType = "DEPOSIT" | "WITHDRAWAL"

export interface Account {
  id: number
  userId: number
  userName: string
  accountType: AccountType
  balance: number
}

export interface Transaction {
  id: number
  accountId: number
  type: TransactionType
  amount: number
  createdAt: string
  category: string
}

export interface MonthlyFlow {
  month: string
  deposits: number
  withdrawals: number
  closingBalance: number
}

// Derives six months from full history of transactions returned
// Used for displaying transaction data
export function monthlyFlows(
  balance: number,
  transactions: Transaction[],
  now = new Date()
): MonthlyFlow[] {
  return Array.from({ length: 6 }, (_, index) => {
    const start = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1)
    const inMonth = transactions.filter((txn) => {
      const date = new Date(txn.createdAt)
      return date >= start && date < end
    })
    const totals = summarize(inMonth)
    const laterNet = transactions.reduce((sum, txn) => {
      if (new Date(txn.createdAt) < end) return sum
      return sum + (txn.type === "DEPOSIT" ? txn.amount : -txn.amount)
    }, 0)
    return {
      month: start.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      deposits: totals.deposits,
      withdrawals: totals.withdrawals,
      closingBalance: balance - laterNet,
    }
  })
}

// Derives current month data for account details page
export function currentMonthTransactions(
  transactions: Transaction[],
  now = new Date()
) {
  return transactions.filter((txn) => {
    const date = new Date(txn.createdAt)
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    )
  })
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number) {
  return currency.format(value)
}

// Compacts to $12.5K rather than $12,480.00
export function formatCompactCurrency(value: number) {
  return compact.format(value)
}

// Derives and formats date
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export interface AccountSummary {
  deposits: number
  withdrawals: number
  netFlow: number
  transactionCount: number
  depositShare: number  //portion of money movement that is a deposit 0-1
  spendRate: number 
}

export function summarize(transactions: Transaction[]): AccountSummary {
  const deposits = sumBy(transactions, "DEPOSIT")
  const withdrawals = sumBy(transactions, "WITHDRAWAL")
  const total = deposits + withdrawals

  return {
    deposits,
    withdrawals,
    netFlow: deposits - withdrawals,
    transactionCount: transactions.length,
    depositShare: total === 0 ? 0 : deposits / total,
    spendRate: deposits === 0 ? 0 : withdrawals / deposits,
  }
}

function sumBy(transactions: Transaction[], type: TransactionType) {
  return transactions
    .filter((txn) => txn.type === type)
    .reduce((total, txn) => total + txn.amount, 0)
}
