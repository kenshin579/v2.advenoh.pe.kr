/**
 * 모든 외부 데이터 loader를 호출해 `.cache/*.json` 시드를 생성한다.
 * 로컬에서 `npx tsx scripts/warm-cache.ts` 로 실행 후 생성된 `.cache/*.json`을 git에 커밋한다.
 * Netlify 빌드는 자체적으로 fetch 후 덮어쓰지만, 실패 시 stale fallback으로 이 시드가 사용된다.
 */
import { getStatusSnapshot } from '../lib/status'
import { getGithubContrib } from '../lib/github'
import { getWritingBlog, getWritingInvestment } from '../lib/writing'
import { getSkills } from '../lib/skills'

async function main() {
  const tasks: Array<[string, () => Promise<unknown>]> = [
    ['status', getStatusSnapshot],
    ['github', getGithubContrib],
    ['writing:blog', getWritingBlog],
    ['writing:investment', getWritingInvestment],
    ['skills', getSkills],
  ]

  for (const [label, loader] of tasks) {
    const start = Date.now()
    try {
      await loader()
      console.log(`  ✓ ${label} (${Date.now() - start}ms)`)
    } catch (err) {
      console.warn(`  ! ${label} 실패:`, (err as Error).message)
    }
  }

  console.log('캐시 시드 생성 완료 — .cache/ 디렉터리 확인')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
