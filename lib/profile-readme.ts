import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Locale } from './i18n/types'

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

function pickStr(data: Record<string, unknown>, base: string, locale: Locale): string | undefined {
  const localed = data[`${base}_${locale}`]
  if (typeof localed === 'string' && localed.trim()) return localed
  const fallback = data[base]
  if (typeof fallback === 'string' && fallback.trim()) return fallback
  const other = data[`${base}_${locale === 'en' ? 'ko' : 'en'}`]
  return typeof other === 'string' && other.trim() ? other : undefined
}

export function loadReadme(locale: Locale): ReadmeData {
  try {
    const p = path.join(process.cwd(), 'contents/profile/readme.md')
    const raw = fs.readFileSync(p, 'utf8')
    const { data, content } = matter(raw)
    const body = pickStr(data, 'body', locale) ?? content.trim()
    return {
      role: pickStr(data, 'role', locale),
      focus: pickStr(data, 'focus', locale),
      based: pickStr(data, 'based', locale),
      xp: pickStr(data, 'xp', locale),
      headline: pickStr(data, 'headline', locale),
      stack: parseArray(data.stack),
      db: parseArray(data.db),
      cloud: parseArray(data.cloud),
      cicd: parseArray(data.cicd),
      body,
    }
  } catch {
    return { body: '' }
  }
}
