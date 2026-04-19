import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ReadmeData = {
  role?: string
  focus?: string
  based?: string
  xp?: string
  headline?: string
  stack?: string[]
  db?: string[]
  cloud?: string[]
  cicd?: string[]
  body: string
}

function parseArray(v: unknown): string[] | undefined {
  if (Array.isArray(v)) {
    const arr = v.filter((x): x is string => typeof x === 'string').map(s => s.trim()).filter(Boolean)
    return arr.length > 0 ? arr : undefined
  }
  if (typeof v === 'string') {
    const arr = v.split(',').map(s => s.trim()).filter(Boolean)
    return arr.length > 0 ? arr : undefined
  }
  return undefined
}

export function loadReadme(): ReadmeData {
  try {
    const p = path.join(process.cwd(), 'contents/profile/readme.md')
    const raw = fs.readFileSync(p, 'utf8')
    const { data, content } = matter(raw)
    return {
      role: typeof data.role === 'string' ? data.role : undefined,
      focus: typeof data.focus === 'string' ? data.focus : undefined,
      based: typeof data.based === 'string' ? data.based : undefined,
      xp: typeof data.xp === 'string' ? data.xp : undefined,
      headline: typeof data.headline === 'string' ? data.headline : undefined,
      stack: parseArray(data.stack),
      db: parseArray(data.db),
      cloud: parseArray(data.cloud),
      cicd: parseArray(data.cicd),
      body: content.trim(),
    }
  } catch {
    return { body: '' }
  }
}
