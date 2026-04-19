/**
 * 화면 전체 fractalNoise 오버레이. `--profile-noise` CSS 변수로 opacity 바인딩.
 * Tweaks panel의 noise slider가 --profile-noise를 수정하면 즉시 반응.
 * 정적 SVG + CSS만이므로 Client 불필요.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 mix-blend-overlay"
      style={{
        opacity: 'var(--profile-noise)',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.7'/%3E%3C/svg%3E\")",
      }}
    />
  )
}
