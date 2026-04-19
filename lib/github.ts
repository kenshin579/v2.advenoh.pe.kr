import { z } from 'zod'
import { withCache } from './cache'
import { siteConfig } from './site-config'

const levelSchema = z.enum([
  'NONE',
  'FIRST_QUARTILE',
  'SECOND_QUARTILE',
  'THIRD_QUARTILE',
  'FOURTH_QUARTILE',
])

const daySchema = z.object({
  date: z.string(),
  contributionCount: z.number(),
  contributionLevel: levelSchema,
})

const weekSchema = z.object({
  contributionDays: z.array(daySchema),
})

export const githubContribSchema = z.object({
  fetchedAt: z.string(),
  login: z.string(),
  totalContributions: z.number(),
  weeks: z.array(weekSchema),
  from: z.string(),
  to: z.string(),
})

export type ContributionLevel = z.infer<typeof levelSchema>
export type ContributionDay = z.infer<typeof daySchema>
export type GithubContrib = z.infer<typeof githubContribSchema>

const GQL_QUERY = `query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

function buildEmptyWeeks(from: Date, to: Date) {
  const weeks: { contributionDays: ContributionDay[] }[] = []
  let cursor = new Date(from)
  while (cursor <= to) {
    const days: ContributionDay[] = []
    for (let i = 0; i < 7 && cursor <= to; i++) {
      days.push({
        date: cursor.toISOString().slice(0, 10),
        contributionCount: 0,
        contributionLevel: 'NONE',
      })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    weeks.push({ contributionDays: days })
  }
  return weeks
}

function buildFallback(): GithubContrib {
  const to = new Date()
  const from = new Date(to)
  from.setUTCDate(from.getUTCDate() - 26 * 7 + 1)
  return {
    fetchedAt: new Date(0).toISOString(),
    login: siteConfig.githubLogin,
    totalContributions: 0,
    weeks: buildEmptyWeeks(from, to),
    from: from.toISOString(),
    to: to.toISOString(),
  }
}

async function fetchGithubContrib(): Promise<GithubContrib> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN 미설정 — PR preview 컨텍스트에서는 정상 (폴백 사용)')

  const to = new Date()
  const from = new Date(to)
  from.setUTCDate(from.getUTCDate() - 26 * 7 + 1)

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GQL_QUERY,
      variables: {
        login: siteConfig.githubLogin,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  })

  if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(`GitHub GraphQL error: ${JSON.stringify(json.errors)}`)

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar
  if (!calendar) throw new Error('GraphQL 응답에 contributionCalendar 없음')

  const snapshot: GithubContrib = {
    fetchedAt: new Date().toISOString(),
    login: siteConfig.githubLogin,
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
    from: from.toISOString(),
    to: to.toISOString(),
  }
  return githubContribSchema.parse(snapshot)
}

export function getGithubContrib(): Promise<GithubContrib> {
  return withCache('github-contrib.json', fetchGithubContrib, buildFallback(), 'github')
}
