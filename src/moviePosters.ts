import type { MovieEntry } from './movies'
import { resolveLocalPoster } from './localPosters'

const posterCache = new Map<string, string | null>()
const inFlight = new Map<string, Promise<string | null>>()
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

let queueTail: Promise<void> = Promise.resolve()
const queueGapMs = 120

function cacheKey(movie: Pick<MovieEntry, 'title' | 'releaseDate'>): string {
  const year = movie.releaseDate.getFullYear()
  return `${year}::${movie.title}`
}

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function titleVariants(title: string): string[] {
  const variants = [title.trim()]
  const colon = title.split(':')[0]?.trim()
  if (colon && !variants.includes(colon)) variants.push(colon)
  const dash = title.split('—')[0]?.trim()
  if (dash && !variants.includes(dash)) variants.push(dash)
  const hyphen = title.split(' - ')[0]?.trim()
  if (hyphen && !variants.includes(hyphen)) variants.push(hyphen)
  const words = title.trim().split(/\s+/).slice(0, 4).join(' ')
  if (words && !variants.includes(words)) variants.push(words)
  return variants
}

function scoreTitle(query: string, candidate: string, year: number, candidateYear?: number): number {
  const q = normalizeTitle(query)
  const c = normalizeTitle(candidate)
  if (!q || !c) return 0

  let score = 0
  if (c === q) score += 100
  else if (c.startsWith(q) || q.startsWith(c)) score += 75
  else {
    const qWords = new Set(q.split(' ').filter(Boolean))
    const overlap = c.split(' ').filter((word) => qWords.has(word)).length
    score += overlap * 18
  }

  if (candidateYear && Math.abs(candidateYear - year) <= 1) score += 35
  return score
}

function enqueuePosterTask<T>(task: () => Promise<T>): Promise<T> {
  const run = queueTail.then(async () => {
    await new Promise((resolve) => setTimeout(resolve, queueGapMs))
    return task()
  })
  queueTail = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

async function fetchTmdbPoster(
  title: string,
  year: number,
  signal: AbortSignal,
): Promise<string | null> {
  if (!tmdbKey) return null

  let best: { url: string; score: number } | null = null

  for (const variant of titleVariants(title)) {
    const params = new URLSearchParams({
      api_key: tmdbKey,
      query: variant,
      include_adult: 'false',
      year: String(year),
    })
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, { signal })
    if (!response.ok) continue

    const data = (await response.json()) as {
      results?: { title?: string; poster_path?: string | null; release_date?: string }[]
    }

    for (const hit of data.results ?? []) {
      if (!hit.poster_path) continue
      const hitYear = hit.release_date ? Number(hit.release_date.slice(0, 4)) : undefined
      const score = scoreTitle(title, hit.title ?? variant, year, hitYear)
      const url = `https://image.tmdb.org/t/p/w342${hit.poster_path}`
      if (!best || score > best.score) best = { url, score }
    }
  }

  return best && best.score >= 50 ? best.url : null
}

async function fetchImdbPoster(
  title: string,
  year: number,
  signal: AbortSignal,
): Promise<string | null> {
  let best: { url: string; score: number } | null = null

  for (const variant of titleVariants(title)) {
    const slug = encodeURIComponent(variant)
    const response = await fetch(`https://v2.sg.media-imdb.com/suggestion/t/${slug}.json`, {
      signal,
    })
    if (!response.ok) continue

    const data = (await response.json()) as {
      d?: { l?: string; y?: number; i?: { imageUrl?: string } }[]
    }

    for (const hit of data.d ?? []) {
      const imageUrl = hit.i?.imageUrl
      if (!imageUrl) continue
      const score = scoreTitle(title, hit.l ?? variant, year, hit.y)
      if (!best || score > best.score) best = { url: imageUrl, score }
    }
  }

  return best && best.score >= 50 ? best.url : null
}

async function resolveRemotePoster(
  title: string,
  year: number,
  signal: AbortSignal,
): Promise<string | null> {
  const imdb = await fetchImdbPoster(title, year, signal)
  if (imdb) return imdb
  return fetchTmdbPoster(title, year, signal)
}

export async function fetchRemoteMoviePoster(
  movie: Pick<MovieEntry, 'title' | 'releaseDate'>,
  signal: AbortSignal,
): Promise<string | null> {
  const year = movie.releaseDate.getFullYear()
  const key = `remote::${cacheKey(movie)}`
  if (posterCache.has(key)) return posterCache.get(key) ?? null

  const pending = inFlight.get(key)
  if (pending) return pending

  const job = enqueuePosterTask(() => resolveRemotePoster(movie.title, year, signal))
    .then((url) => {
      if (!signal.aborted) posterCache.set(key, url)
      inFlight.delete(key)
      return url
    })
    .catch((error) => {
      inFlight.delete(key)
      if (signal.aborted) throw error
      throw error
    })

  inFlight.set(key, job)
  return job
}

export async function fetchMoviePoster(
  movie: Pick<MovieEntry, 'title' | 'releaseDate' | 'posterFile'>,
  signal: AbortSignal,
): Promise<string | null> {
  const key = cacheKey(movie)
  if (posterCache.has(key)) return posterCache.get(key) ?? null

  const pending = inFlight.get(key)
  if (pending) return pending

  const job = enqueuePosterTask(async () => {
    const local = await resolveLocalPoster(movie, signal)
    if (local) return local
    return resolveRemotePoster(movie.title, movie.releaseDate.getFullYear(), signal)
  })
    .then((url) => {
      if (!signal.aborted) posterCache.set(key, url)
      inFlight.delete(key)
      return url
    })
    .catch((error) => {
      inFlight.delete(key)
      throw error
    })

  inFlight.set(key, job)
  return job
}

export function cachedMoviePoster(
  movie: Pick<MovieEntry, 'title' | 'releaseDate' | 'posterFile'>,
): string | null | undefined {
  const key = cacheKey(movie)
  if (!posterCache.has(key)) return undefined
  return posterCache.get(key) ?? null
}

export function imdbFindUrl(title: string): string {
  return `https://www.imdb.com/find/?q=${encodeURIComponent(title)}`
}
