import type { ReactNode } from "react"

interface StatTileProps {
  label: string
  value: string
  /** Signed change against a named period, e.g. "+4.2% vs August". */
  delta?: string
  /** Whether the delta reads as good — drives its colour, not its sign. */
  deltaIsGood?: boolean
  /** A colour-slot dot tying the tile to its series in the charts. */
  colorVar?: string
  children?: ReactNode
}

export function StatTile({
  label,
  value,
  delta,
  deltaIsGood,
  colorVar,
  children,
}: StatTileProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {colorVar && (
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: colorVar }}
          />
        )}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>

      <p className="mt-1.5 text-2xl font-semibold text-foreground">{value}</p>

      {delta && (
        <p
          className="mt-1 text-xs"
          style={{
            color: deltaIsGood ? "var(--viz-good)" : "var(--viz-critical)",
          }}
        >
          {delta}
        </p>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  )
}
