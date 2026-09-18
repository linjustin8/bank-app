import { useState } from "react"
import { formatCurrency } from "~/lib/account-data"

export interface DonutSlice {
  key: string
  label: string
  /** Short qualifier shown beside the label, e.g. "In" / "Out". */
  tag?: string
  value: number
  /** A `var(--viz-n)` slot. Slots are assigned in fixed order, never cycled. */
  colorVar: string
}

interface DonutChartProps {
  slices: DonutSlice[]
  /** Shown in the ring's centre when nothing is hovered or focused. */
  totalLabel: string
}

const RADIUS = 76
const THICKNESS = 26
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** 2px of surface showing between neighbouring fills, in viewBox units. */
const GAP = 2

export function DonutChart({ slices, totalLabel }: DonutChartProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const total = slices.reduce((sum, slice) => sum + slice.value, 0)
  const active = slices.find((slice) => slice.key === activeKey) ?? null

  // Running offset so each arc starts where the previous one ended.
  let consumed = 0
  const arcs = slices.map((slice) => {
    const share = total === 0 ? 0 : slice.value / total
    const arcLength = share * CIRCUMFERENCE
    const offset = consumed
    consumed += arcLength
    return { slice, share, arcLength, offset }
  })

  const centreValue = active ? active.value : total
  const centreCaption = active ? active.label : totalLabel

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="relative mx-auto size-[200px] shrink-0">
        <svg
          viewBox="0 0 200 200"
          className="size-full -rotate-90"
          role="img"
          aria-label={`${totalLabel}: ${formatCurrency(total)}, split across ${slices.length} categories`}
        >
          {arcs.map(({ slice, arcLength, offset }) => {
            const isDimmed = activeKey !== null && activeKey !== slice.key
            return (
              <circle
                key={slice.key}
                cx={100}
                cy={100}
                r={RADIUS}
                fill="none"
                stroke={slice.colorVar}
                strokeWidth={THICKNESS}
                strokeLinecap="butt"
                // The transparent remainder of the dash pattern lets the card
                // surface show through as the 2px separator between fills.
                strokeDasharray={`${Math.max(arcLength - GAP, 0)} ${CIRCUMFERENCE - Math.max(arcLength - GAP, 0)}`}
                strokeDashoffset={-offset}
                className="origin-center cursor-pointer transition-opacity duration-150 focus-visible:outline-none"
                opacity={isDimmed ? 0.35 : 1}
                tabIndex={0}
                aria-label={`${slice.label}: ${formatCurrency(slice.value)}`}
                onPointerEnter={() => setActiveKey(slice.key)}
                onPointerLeave={() => setActiveKey(null)}
                onFocus={() => setActiveKey(slice.key)}
                onBlur={() => setActiveKey(null)}
              />
            )
          })}
        </svg>

        {/* Centre readout — the donut's hover layer. Doubles as the resting
            total, so no value is reachable only by hovering. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <span className="text-xl font-semibold text-foreground">
            {formatCurrency(centreValue)}
          </span>
          <span className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
            {centreCaption}
          </span>
        </div>
      </div>

      {/* Legend with values — identity never rests on colour alone, and it is
          the table view for the slots that sit below 3:1 on a white surface. */}
      <ul className="flex-1 space-y-1">
        {arcs.map(({ slice, share }) => (
          <li key={slice.key}>
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onPointerEnter={() => setActiveKey(slice.key)}
              onPointerLeave={() => setActiveKey(null)}
              onFocus={() => setActiveKey(slice.key)}
              onBlur={() => setActiveKey(null)}
            >
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.colorVar }}
              />
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {slice.label}
                {slice.tag && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {slice.tag}
                  </span>
                )}
              </span>
              <span className="text-sm text-secondary-foreground tabular-nums">
                {formatCurrency(slice.value)}
              </span>
              <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                {Math.round(share * 100)}%
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
