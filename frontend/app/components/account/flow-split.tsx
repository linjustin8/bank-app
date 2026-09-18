import { formatCurrency } from "~/lib/account-data"

interface FlowSplitProps {
  deposits: number
  withdrawals: number
}


// Deposits against withdrawals as line bar
export function FlowSplit({ deposits, withdrawals }: FlowSplitProps) {
  const total = deposits + withdrawals
  const depositShare = total === 0 ? 0 : deposits / total

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Money in</p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(deposits)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Money out</p>
          <p className="text-lg font-semibold text-foreground">
            {formatCurrency(withdrawals)}
          </p>
        </div>
      </div>

      {/* 2px surface gap separates the two fills — no stroke around either. */}
      <div
        className="mt-3 flex h-2.5 gap-0.5 overflow-hidden rounded-full"
        role="img"
        aria-label={`${Math.round(depositShare * 100)}% of this month's movement was deposits`}
      >
        <div
          className="rounded-full"
          style={{
            width: `${depositShare * 100}%`,
            backgroundColor: "var(--viz-1)",
          }}
        />
        <div
          className="flex-1 rounded-full"
          style={{ backgroundColor: "var(--viz-2)" }}
        />
      </div>
    </div>
  )
}
