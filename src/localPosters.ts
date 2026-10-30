import type { MovieEntry } from './movies'

const extensions = ['webp', 'jpg', 'jpeg', 'png'] as const

export function posterSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function localPosterUrl(fileName: string): string {
  const clean = fileName.replace(/^\/+/, '').replace(/^assets\/images\//, '')
  const relative = `${import.meta.env.BASE_URL}assets/images/${clean}`.replace(/\/{2,}/g, '/')
  if (typeof document !== 'undefined') {
    return new URL(relative, document.baseURI).href
  }
  return relative
}

/** Default repo poster path: public/assets/images/{slug}.jpg */
export function primaryLocalPoster(movie: Pick<MovieEntry, 'title' | 'posterFile'>): string {
  const explicit = movie.posterFile?.trim()
  if (explicit) {
    return localPosterUrl(explicit.includes('.') ? explicit : `${explicit}.jpg`)
  }
  return localPosterUrl(`${posterSlug(movie.title)}.jpg`)
}

export function localPosterCandidates(movie: Pick<MovieEntry, 'title' | 'posterFile'>): string[] {
  const names: string[] = []
  const explicit = movie.posterFile?.trim()
  if (explicit) {
    names.push(explicit)
    if (!explicit.includes('.')) {
      for (const ext of extensions) names.push(`${explicit}.${ext}`)
    }
  }

  const slug = posterSlug(movie.title)
  for (const ext of extensions) {
    names.push(`${slug}.${ext}`)
  }

  return [...new Set(names)].map((name) => localPosterUrl(name))
}

function probeImage(url: string, signal: AbortSignal): Promise<boolean> {
  if (signal.aborted) return Promise.resolve(false)

  return new Promise((resolve) => {
    const img = new Image()
    const onAbort = () => {
      cleanup()
      resolve(false)
    }

    const cleanup = () => {
      signal.removeEventListener('abort', onAbort)
      img.onload = null
      img.onerror = null
    }

    signal.addEventListener('abort', onAbort, { once: true })
    img.onload = () => {
      cleanup()
      resolve(true)
    }
    img.onerror = () => {
      cleanup()
      resolve(false)
    }
    img.src = url
  })
}

export async function resolveLocalPoster(
  movie: Pick<MovieEntry, 'title' | 'posterFile'>,
  signal: AbortSignal,
): Promise<string | null> {
  for (const url of localPosterCandidates(movie)) {
    if (await probeImage(url, signal)) return url
  }
  return null
}
