interface SparklineProps {
  values: number[]
  colorVar?: string
  surfaceVar?: string //color around end marker to match the surface
  className?: string
}

const WIDTH = 100
const HEIGHT = 32

// Axis-less and unlabelled trend line used for the balance card
export function Sparkline({
  values,
  colorVar = "var(--viz-1)",
  surfaceVar = "var(--color-card)",
  className,
}: SparklineProps) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const inset = 3

  const points = values.map((value, index) => ({
    x: (index / (values.length - 1)) * WIDTH,
    y: inset + (1 - (value - min) / span) * (HEIGHT - inset * 2),
  }))

  const line = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ")
  const area = `${line} L${WIDTH} ${HEIGHT} L0 ${HEIGHT} Z`
  const end = points[points.length - 1]

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={className}
      aria-hidden
    >
      <path d={area} fill={colorVar} opacity={0.1} />
      <path
        d={line}
        fill="none"
        stroke={colorVar}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={end.x}
        cy={end.y}
        r={2.5}
        fill={colorVar}
        stroke={surfaceVar}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
