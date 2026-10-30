import { useEffect, useMemo, useRef, useState } from 'react'
import { useNow } from './hooks'
import { noticeStats } from './notice'
import { getDailyCopy } from './noticeContent'
import { NoticeToday } from './NoticeToday'
import { primaryLocalPoster } from './localPosters'
import { fetchRemoteMoviePoster, imdbFindUrl } from './moviePosters'
import { movieKey, movieTimeline, upcomingMovies, type MovieEntry } from './movies'

function placeholderHue(title: string): number {
  let hash = 0
  for (let i = 0; i < title.length; i += 1) hash = (hash * 31 + title.charCodeAt(i)) % 360
  return hash
}

function MoviePoster({ movie }: { movie: MovieEntry }) {
  const localSrc = useMemo(() => primaryLocalPoster(movie), [movie.title, movie.posterFile])
  const [src, setSrc] = useState(localSrc)
  const [failed, setFailed] = useState(false)
  const [loadingRemote, setLoadingRemote] = useState(false)

  useEffect(() => {
    setSrc(localSrc)
    setFailed(false)
    setLoadingRemote(false)
  }, [localSrc])

  function onImageError() {
    if (src === localSrc && !loadingRemote) {
      setLoadingRemote(true)
      const controller = new AbortController()
      fetchRemoteMoviePoster(movie, controller.signal)
        .then((url) => {
          if (url) setSrc(url)
          else setFailed(true)
        })
        .catch(() => setFailed(true))
        .finally(() => setLoadingRemote(false))
      return
    }
    setFailed(true)
  }

  if (!failed && src) {
    return (
      <img
        className="movie-poster"
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={onImageError}
      />
    )
  }

  const hue = placeholderHue(movie.title)
  return (
    <div
      className={`movie-poster movie-poster-fallback${loadingRemote ? ' movie-poster-loading' : ''}`}
      style={{
        background: loadingRemote
          ? undefined
          : `linear-gradient(145deg, hsl(${hue} 42% 42%), hsl(${(hue + 40) % 360} 38% 28%))`,
      }}
      aria-hidden="true"
    >
      {!loadingRemote ? <span aria-hidden="true">{movie.title.slice(0, 1)}</span> : null}
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
      href={imdbFindUrl(movie.title)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Find ${movie.title} on IMDb`}
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
