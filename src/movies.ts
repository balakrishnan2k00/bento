import rawList from '../movielist.txt?raw'

export type MovieEntry = {
  language: string
  releaseDate: Date
  title: string
  /** Optional filename under public/assets/images/ (e.g. mookuthi-amman-2.jpg) */
  posterFile?: string
}

function parseReleaseDate(value: string): Date {
  const parsed = Date.parse(value.trim())
  if (Number.isNaN(parsed)) return new Date(0)
  return new Date(parsed)
}

export function parseMovieList(source: string): MovieEntry[] {
  const entries: MovieEntry[] = []
  let language = ''

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith('Release date')) continue

    const tab = trimmed.indexOf('\t')
    if (tab === -1) {
      language = trimmed
      continue
    }

    const dateStr = trimmed.slice(0, tab).trim()
    const rest = trimmed.slice(tab + 1)
    const titleTab = rest.indexOf('\t')
    const title = (titleTab === -1 ? rest : rest.slice(0, titleTab)).trim()
    const posterFile =
      titleTab === -1 ? undefined : rest.slice(titleTab + 1).trim() || undefined
    if (!title) continue

    entries.push({
      language,
      title,
      releaseDate: parseReleaseDate(dateStr),
      posterFile,
    })
  }

  return entries.sort(
    (a, b) => a.releaseDate.getTime() - b.releaseDate.getTime() || a.title.localeCompare(b.title),
  )
}

export const movieTimeline = parseMovieList(rawList)

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Movies still on or before today in local time stay visible; past release days drop off. */
export function upcomingMovies(movies: MovieEntry[], now: Date): MovieEntry[] {
  const today = startOfLocalDay(now)
  return movies.filter((movie) => startOfLocalDay(movie.releaseDate) >= today)
}

export function movieKey(movie: MovieEntry): string {
  return `${movie.releaseDate.toISOString()}-${movie.language}-${movie.title}`
}
