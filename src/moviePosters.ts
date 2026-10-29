const posterCache = new Map<string, string | null>()
const tmdbKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined

function cacheKey(title: string, year: number): string {
  return `${year}::${title}`
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

  return best && best.score >= 58 ? best.url : null
}

export async function fetchMoviePoster(
  title: string,
  year: number,
  signal: AbortSignal,
): Promise<string | null> {
  const key = cacheKey(title, year)
  if (posterCache.has(key)) return posterCache.get(key) ?? null

  let url = await fetchTmdbPoster(title, year, signal)
  if (!url) url = await fetchImdbPoster(title, year, signal)

  posterCache.set(key, url)
  return url
}

export function cachedMoviePoster(title: string, year: number): string | null | undefined {
  const key = cacheKey(title, year)
  if (!posterCache.has(key)) return undefined
  return posterCache.get(key) ?? null
}
