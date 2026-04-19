import fs from 'fs'
import path from 'path'

const CACHE_DIR = path.join(process.cwd(), '.cache')

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true })
}

export function readCache<T>(filename: string): T | null {
  const file = path.join(CACHE_DIR, filename)
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')) as T
  } catch {
    return null
  }
}

export function writeCache<T>(filename: string, data: T): void {
  ensureCacheDir()
  const file = path.join(CACHE_DIR, filename)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

/**
 * 공통 캐시 정책 (옵션 A 하이브리드):
 * 1. fetcher() 시도 → 성공 시 캐시 덮어쓰고 fresh 반환
 * 2. 실패 시 기존 캐시 반환 (stale, WARN 로그)
 * 3. 캐시도 없으면 fallback 반환
 */
export async function withCache<T>(
  filename: string,
  fetcher: () => Promise<T>,
  fallback: T,
  label = filename
): Promise<T> {
  try {
    const fresh = await fetcher()
    writeCache(filename, fresh)
    return fresh
  } catch (err) {
    const stale = readCache<T>(filename)
    if (stale) {
      console.warn(`[cache:WARN] ${label} fetch 실패, stale cache 사용:`, (err as Error).message)
      return stale
    }
    console.warn(`[cache:WARN] ${label} fetch 실패 + cache 부재, 하드코딩 폴백:`, (err as Error).message)
    return fallback
  }
}
