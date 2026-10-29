import { useEffect, useMemo, useRef, useState } from 'react'
import { useNow } from './hooks'
import { noticeStats } from './notice'
import { getDailyCopy } from './noticeContent'
import { NoticeToday } from './NoticeToday'
import { cachedMoviePoster, fetchMoviePoster } from './moviePosters'
import { movieKey, movieTimeline, upcomingMovies, type MovieEntry } from './movies'

function placeholderHue(title: string): number {
  let hash = 0
  for (let i = 0; i < title.length; i += 1) hash = (hash * 31 + title.charCodeAt(i)) % 360
  return hash
}

function googleSearchUrl(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(title)}`
}

function MoviePoster({ movie }: { movie: MovieEntry }) {
  const year = movie.releaseDate.getFullYear()
  const cached = cachedMoviePoster(movie.title, year)
  const [poster, setPoster] = useState<string | null>(cached ?? null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(cached === undefined)

  useEffect(() => {
    if (cached !== undefined) {
      setPoster(cached)
      setLoading(false)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    fetchMoviePoster(movie.title, year, controller.signal)
      .then((url) => setPoster(url))
      .catch(() => undefined)
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [movie.title, year, cached])

  if (poster && !failed) {
    return (
      <img
        className="movie-poster"
        src={poster}
        alt=""
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  }

  const hue = placeholderHue(movie.title)
  return (
    <div
      className={`movie-poster movie-poster-fallback${loading ? ' movie-poster-loading' : ''}`}
      style={{
        background: loading
          ? undefined
          : `linear-gradient(145deg, hsl(${hue} 42% 42%), hsl(${(hue + 40) % 360} 38% 28%))`,
      }}
      aria-hidden="true"
    >
      {!loading ? <span aria-hidden="true">{movie.title.slice(0, 1)}</span> : null}
    </div>
  )
}

function formatRelease(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function TimelineItem({
  movie,
  posterSide,
  index,
}: {
  movie: MovieEntry
  posterSide: 'left' | 'right'
  index: number
}) {
  const poster = (
    <a
      className="movie-poster-link"
      href={googleSearchUrl(movie.title)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Search Google for ${movie.title}`}
    >
      <MoviePoster movie={movie} />
    </a>
  )
  const copy = (
    <div className="movie-timeline-copy">
      <time dateTime={movie.releaseDate.toISOString()}>{formatRelease(movie.releaseDate)}</time>
      <p className="movie-timeline-title">{movie.title}</p>
    </div>
  )

  return (
    <li
      className={`movie-timeline-item movie-timeline-item--poster-${posterSide}`}
      style={{ animationDelay: `${(index % 8) * 0.08}s` }}
    >
      <div className="movie-timeline-wing movie-timeline-wing--left">
        {posterSide === 'left' ? poster : copy}
      </div>
      <span className="movie-timeline-dot" aria-hidden="true" />
      <div className="movie-timeline-wing movie-timeline-wing--right">
        {posterSide === 'left' ? copy : poster}
      </div>
    </li>
  )
}

function TimelineList({
  movies,
  startIndex = 0,
  hidden = false,
}: {
  movies: MovieEntry[]
  startIndex?: number
  hidden?: boolean
}) {
  return (
    <ol className="movie-timeline" aria-hidden={hidden || undefined}>
      {movies.map((movie, index) => (
        <TimelineItem
          key={`${movieKey(movie)}-${startIndex + index}`}
          movie={movie}
          posterSide={(startIndex + index) % 2 === 0 ? 'left' : 'right'}
          index={startIndex + index}
        />
      ))}
    </ol>
  )
}

export function MovieTimeline() {
  const now = useNow()
  const upcoming = useMemo(() => upcomingMovies(movieTimeline, now), [now])
  const stats = useMemo(() => noticeStats(now), [now])
  const dayKey = `${stats.today.getFullYear()}-${stats.today.getMonth() + 1}-${stats.today.getDate()}`
  const daily = useMemo(() => getDailyCopy(stats), [dayKey, stats.elapsedDays])
  const viewportRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)

  function onEnter() {
    setPaused(true)
  }

  function onLeave() {
    const viewport = viewportRef.current
    if (viewport) viewport.scrollTop = 0
    setPaused(false)
  }

  return (
    <aside className="rail rail-right movie-rail" aria-label="Today and upcoming releases">
      <NoticeToday daily={daily} placement="right" />
      <header className="movie-rail-head">
        <h2 className="movie-rail-label">Upcoming Releases</h2>
      </header>
      <div
        ref={viewportRef}
        className={`movie-rail-viewport${paused ? ' movie-rail-viewport--scroll' : ''}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        tabIndex={0}
      >
        {upcoming.length === 0 ? (
          <p className="movie-rail-empty">No upcoming releases</p>
        ) : (
          <div className={`movie-rail-track${paused ? ' movie-rail-track--paused' : ''}`}>
            <TimelineList movies={upcoming} />
            <TimelineList movies={upcoming} startIndex={upcoming.length} hidden />
          </div>
        )}
      </div>
    </aside>
  )
}
