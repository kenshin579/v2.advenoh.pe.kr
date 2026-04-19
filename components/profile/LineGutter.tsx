type LineGutterProps = {
  lines?: number
}

/**
 * IDE 스타일 라인 번호 gutter. 메인 콘텐츠 좌측에 상대 위치로 배치된다.
 * 실제 텍스트 라인과 일치하지 않는 장식 요소 — 고정 48 라인 생성.
 */
export function LineGutter({ lines = 48 }: LineGutterProps) {
  return (
    <div
      aria-hidden="true"
      className="hidden md:flex w-10 shrink-0 select-none flex-col items-end pr-2 pt-6 font-mono text-[10px] leading-6 text-profile-muted-2"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i}>{i + 1}</span>
      ))}
    </div>
  )
}
