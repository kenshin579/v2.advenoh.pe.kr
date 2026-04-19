type SparklineProps = {
  values: number[]
  width?: number
  height?: number
  strokeWidth?: number
  className?: string
}

/**
 * 순수 SVG 스파크라인 — 차트 라이브러리 의존성 없음.
 * `currentColor`로 stroke 색상을 바인딩하므로 상위에서 `text-profile-*`로 색 조정.
 */
export function Sparkline({
  values,
  width = 80,
  height = 24,
  strokeWidth = 1.25,
  className,
}: SparklineProps) {
  if (values.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        aria-hidden="true"
      />
    )
  }

  const max = Math.max(...values, 1)
  const step = values.length > 1 ? width / (values.length - 1) : width
  const points = values.map((v, i) => {
    const x = i * step
    const y = height - (v / max) * height
    return [x, y] as const
  })
  const d = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
