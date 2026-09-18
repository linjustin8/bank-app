import { useState } from "react"
import {
  formatCompactCurrency,
  formatCurrency,
  type MonthlyFlow,
} from "~/lib/account-data"

interface FlowColumnsProps {
  data: MonthlyFlow[]
}

const PLOT_HEIGHT = 176

/** Round the top of the scale up to a clean number so ticks read 0 / 2.5K / 5K. */
function niceMax(value: number) {
  if (value <= 0) return 1000
  const magnitude = 10 ** Math.floor(Math.log10(value))
  return Math.ceil(value / (magnitude / 2)) * (magnitude / 2)
}

export function FlowColumns({ data }: FlowColumnsProps) {
  const [activeMonth, setActiveMonth] = useState<string | null>(null)

  const max = niceMax(
    Math.max(...data.flatMap((row) => [row.deposits, row.withdrawals]))
  )
  const ticks = [max, max / 2, 0]
  const lastMonth = data[data.length - 1]?.month

  return (
    <div>
      <ul className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
        {[
          { label: "Deposits", colorVar: "var(--viz-1)" },
          { label: "Withdrawals", colorVar: "var(--viz-2)" },
        ].map((series) => (
          <li key={series.label} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2.5 w-4 rounded-sm"
              style={{ backgroundColor: series.colorVar }}
            />
            <span className="text-xs text-secondary-foreground">
              {series.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        {/* Y-axis ticks carry the values the columns are not directly labelled with. */}
        <div
          className="flex w-11 shrink-0 flex-col justify-between text-right text-[11px] text-muted-foreground tabular-nums"
          style={{ height: PLOT_HEIGHT }}
          aria-hidden
        >
          {ticks.map((tick) => (
            <span key={tick} className="-translate-y-1.5 leading-none">
              {formatCompactCurrency(tick)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative" style={{ height: PLOT_HEIGHT }}>
            {ticks.map((tick) => (
              <div
                key={tick}
                aria-hidden
                className="absolute inset-x-0 border-t"
                style={{
                  bottom: `${(tick / max) * 100}%`,
                  borderColor:
                    tick === 0 ? "var(--viz-axis)" : "var(--viz-grid)",
                }}
              />
            ))}

            <div className="absolute inset-0 flex items-end justify-between">
              {data.map((row) => {
                const isActive = activeMonth === row.month
                return (
                  <div
                    key={row.month}
                    className="relative flex h-full flex-1 items-end justify-center"
                    onPointerEnter={() => setActiveMonth(row.month)}
                    onPointerLeave={() => setActiveMonth(null)}
                    onFocus={() => setActiveMonth(row.month)}
                    onBlur={() => setActiveMonth(null)}
                    tabIndex={0}
                    aria-label={`${row.month}: deposits ${formatCurrency(row.deposits)}, withdrawals ${formatCurrency(row.withdrawals)}`}
                  >
                    {/* 2px of surface between the touching pair, no strokes. */}
                    <div className="flex h-full w-full items-end justify-center gap-0.5">
                      {[
                        { value: row.deposits, colorVar: "var(--viz-1)" },
                        { value: row.withdrawals, colorVar: "var(--viz-2)" },
                      ].map((series) => (
                        <div
                          key={series.colorVar}
                          className="w-full max-w-[18px] rounded-t-[4px] transition-opacity duration-150"
                          style={{
                            height: `${(series.value / max) * 100}%`,
                            backgroundColor: series.colorVar,
                            opacity:
                              activeMonth !== null && !isActive ? 0.4 : 1,
                          }}
                        />
                      ))}
                    </div>

                    {isActive && (
                      <div
                        role="tooltip"
                        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-lg border bg-popover px-2.5 py-2 text-popover-foreground shadow-md"
                      >
                        <p className="mb-1 text-[11px] font-medium">
                          {row.month}
                        </p>
                        <dl className="space-y-0.5 text-[11px]">
                          {[
                            {
                              label: "Deposits",
                              value: row.deposits,
                              colorVar: "var(--viz-1)",
                            },
                            {
                              label: "Withdrawals",
                              value: row.withdrawals,
                              colorVar: "var(--viz-2)",
                            },
                          ].map((series) => (
                            <div
                              key={series.label}
                              className="flex items-center gap-2"
                            >
                              <span
                                aria-hidden
                                className="size-2 shrink-0 rounded-full"
                                style={{ backgroundColor: series.colorVar }}
                              />
                              <dt className="text-muted-foreground">
                                {series.label}
                              </dt>
                              <dd className="ml-auto pl-3 tabular-nums">
                                {formatCurrency(series.value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            {data.map((row) => (
              <span
                key={row.month}
                className={`flex-1 text-center text-[11px] ${
                  row.month === lastMonth
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {row.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
