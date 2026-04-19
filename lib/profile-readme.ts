import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ReadmeData = {
  role?: string
  focus?: string
  based?: string
  xp?: string
  body: string
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
      body: content.trim(),
    }
  } catch {
    return { body: '' }
  }
}
