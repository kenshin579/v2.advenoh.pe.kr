import { z } from 'zod'
import { withCache } from './cache'
import { siteConfig } from './site-config'

export const skillGroupSchema = z.object({
  emoji: z.string(),
  label: z.string(),
  items: z.array(z.string()),
})

export const skillsSchema = z.object({
  fetchedAt: z.string(),
  groups: z.array(skillGroupSchema),
  flat: z.array(z.string()),
})

export type SkillGroup = z.infer<typeof skillGroupSchema>
export type Skills = z.infer<typeof skillsSchema>

// 하드코딩 폴백: fetch · cache 둘 다 실패 시 표시할 대표 스킬
const FALLBACK: Skills = {
  fetchedAt: new Date(0).toISOString(),
  groups: [
    { emoji: '💻', label: 'Languages', items: ['Java', 'Python', 'Go', 'TypeScript'] },
    { emoji: '☁️', label: 'Cloud', items: ['Kubernetes', 'AWS'] },
  ],
  flat: ['Java', 'Python', 'Go', 'TypeScript', 'Kubernetes', 'AWS'],
}

const GROUP_HEADER_RE = /^-\s*(\p{Extended_Pictographic})\s*(?:&nbsp;\s*)?\**([^*\n]+)\**\s*$/u
const BADGE_RE = /!\[[^\]]*\]\(https:\/\/img\.shields\.io\/badge\/([^?)]+)/g

/**
 * shields.io URL path segment에서 정식 스킬명 추출.
 * 입력: "-Spring%20Boot-6DB33F" → 출력: "Spring Boot"
 *
 * 정규화 규칙:
 *   공백: %20 또는 _
 *   _ 유지: __
 *   - 유지: --
 * 역치환은 `--` / `__` 먼저 임시 치환해 중복 치환을 막는다.
 */
function parseBadgeName(pathAfterBadge: string): string | null {
  let decoded: string
  try {
    decoded = decodeURIComponent(pathAfterBadge)
  } catch {
    return null
  }
  const withoutColor = decoded.replace(/-[0-9A-Fa-f]{3,8}$/, '')
  const name = withoutColor
    .replace(/^-/, '')
    .replace(/--/g, '\u0000DASH\u0000')
    .replace(/__/g, '\u0000UND\u0000')
    .replace(/_/g, ' ')
    .replace(/\u0000DASH\u0000/g, '-')
    .replace(/\u0000UND\u0000/g, '_')
    .trim()
  return name || null
}

function parseSkills(markdown: string): { groups: SkillGroup[]; flat: string[] } {
  const lines = markdown.split('\n')
  const groups: SkillGroup[] = []
  let current: SkillGroup | null = null

  for (const line of lines) {
    const headerMatch = line.match(GROUP_HEADER_RE)
    if (headerMatch) {
      if (current) groups.push(current)
      current = {
        emoji: headerMatch[1],
        label: headerMatch[2].replace(/&nbsp;/g, '').trim(),
        items: [],
      }
      continue
    }
    if (!current) continue

    // 한 라인에 여러 배지가 있을 수 있어 /g 반복
    let m: RegExpExecArray | null
    const re = new RegExp(BADGE_RE.source, 'g')
    while ((m = re.exec(line)) !== null) {
      const name = parseBadgeName(m[1])
      if (name) current.items.push(name)
    }
  }
  if (current) groups.push(current)

  const flat = Array.from(new Set(groups.flatMap(g => g.items)))
  return { groups, flat }
}

async function fetchSkills(): Promise<Skills> {
  const res = await fetch(siteConfig.external.githubProfileReadme)
  if (!res.ok) throw new Error(`README raw ${res.status}`)
  const markdown = await res.text()
  const { groups, flat } = parseSkills(markdown)
  if (groups.length === 0) throw new Error('파싱 결과 그룹 0개 — README 포맷 변경 의심')

  return skillsSchema.parse({
    fetchedAt: new Date().toISOString(),
    groups,
    flat,
  })
}

export function getSkills(): Promise<Skills> {
  return withCache('skills.json', fetchSkills, FALLBACK, 'skills')
}

/**
 * Hero `stack` 라인용: Languages 그룹 + Cloud 그룹 병합을 기본 규칙으로.
 * 매칭되는 그룹이 없으면 groups[0]의 items를 쓴다.
 */
export function pickHeroStack(skills: Skills, max = 8): string[] {
  const langs = skills.groups.find(g => /lang/i.test(g.label))?.items ?? []
  const cloud = skills.groups.find(g => /cloud/i.test(g.label))?.items ?? []
  const base = langs.concat(cloud)
  const source = base.length > 0 ? base : (skills.groups[0]?.items ?? skills.flat)
  return Array.from(new Set(source)).slice(0, max)
}
