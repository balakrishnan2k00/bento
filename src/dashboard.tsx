import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import type { Bookmark } from './data'
import { calendarNote, profile, quote, stories } from './data'
import { useCalendar } from './hooks'
import { formatCalendarKicker, formatClock, formatPillDate, greetingFor } from './format'
import {
  ArrowIcon,
  CalendarMiniIcon,
  Chevron,
  ClockIcon,
  Flag,
  SearchIcon,
  ServiceIcon,
  SparkleIcon,
  WeatherIcon,
} from './icons'

function ExternalLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

export function TopBar({ now, temp, code }: { now: Date; temp: number; code: number }) {
  return (
    <div className="shell-head">
      <h1 className="greeting">
        <Flag />
        {greetingFor(now)}, {profile.name}
      </h1>
      <div className="pills">
        <span className="pill">
          <ClockIcon />
          {formatClock(now)}
        </span>
        <span className="pill">
          <CalendarMiniIcon />
          {formatPillDate(now)}
        </span>
        <span className="pill" title="Lawrenceville, GA">
          <WeatherIcon code={code} />
          {temp}°F
        </span>
        <span className="pill user-pill">
          <span className="avatar" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#e4d2c0" />
              <circle cx="16" cy="13" r="5" fill="#f6ebe2" />
              <path d="M6.5 27.5c2-5 5.6-7.2 9.5-7.2s7.5 2.2 9.5 7.2" fill="#f6ebe2" />
            </svg>
          </span>
          {profile.name}
        </span>
      </div>
    </div>
  )
}

export function SearchBar({
  query,
  engine,
  onQuery,
  onEngine,
  onSubmit,
}: {
  query: string
  engine: 'google' | 'wiki'
  onQuery: (value: string) => void
  onEngine: (engine: 'google' | 'wiki') => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form className="search" role="search" onSubmit={onSubmit}>
      <SearchIcon />
      <input
        id="dashboard-search"
        value={query}
        onChange={(event) => onQuery(event.target.value)}
        placeholder="Search anything..."
        aria-label="Search anything"
        autoComplete="off"
      />
      <div className="engines" role="radiogroup" aria-label="Search engine">
        <button
          type="button"
          className="engine"
          role="radio"
          aria-checked={engine === 'google'}
          onClick={() => onEngine('google')}
        >
          Google
        </button>
        <button
          type="button"
          className="engine"
          role="radio"
          aria-checked={engine === 'wiki'}
          onClick={() => onEngine('wiki')}
        >
          Wiki
        </button>
      </div>
    </form>
  )
}

export function LinkCard({
  title,
  items,
  className,
}: {
  title: string
  items: Bookmark[]
  className?: string
}) {
  return (
    <section className={`card ${className ?? ''}`}>
      <h2 className="card-label">{title}</h2>
      <nav className="link-list" aria-label={title}>
        {items.map((item) => (
          <ExternalLink key={item.label} className="link-row" href={item.href}>
            <ServiceIcon name={item.icon} />
            <span>{item.label}</span>
            <Chevron />
          </ExternalLink>
        ))}
      </nav>
    </section>
  )
}

export function CalendarCard({ now }: { now: Date }) {
  const calendar = useCalendar(now)
  const [setup, setSetup] = useState(false)
  const connected = calendar.source !== 'demo'
  const note =
    calendar.status === 'loading'
      ? 'Loading today’s events…'
      : connected && calendar.events.length === 0 && !calendar.error
        ? 'Nothing on the calendar today.'
        : calendarNote

  return (
    <section className="card calendar-card">
      <h2 className="card-label">Calendar</h2>
      <p className="cal-kicker">{formatCalendarKicker(now)}</p>
      <p className="cal-note">{note}</p>
      <p className="schedule-label">{connected ? 'Today' : "Today's schedule"}</p>
      <ul className="events">
        {calendar.events.map((event) => (
          <li key={`${event.title}-${event.time}`} className="event">
            <span className="plus" aria-hidden="true">
              +
            </span>
            <span>{event.title}</span>
            <time>{event.time}</time>
          </li>
        ))}
      </ul>
      {calendar.error ? <p className="cal-error">{calendar.error}</p> : null}
      {setup ? (
        <form
          className="cal-setup"
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          <label className="cal-field">
            Google client ID
            <input
              value={calendar.clientId}
              onChange={(event) => calendar.setClientId(event.target.value)}
              placeholder="xxxx.apps.googleusercontent.com"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <button className="cal-action" type="button" onClick={() => void calendar.connectGoogle()}>
            Connect Google Calendar
          </button>
          <label className="cal-field">
            Apple or Google iCal URL
            <input
              value={calendar.icalUrl}
              onChange={(event) => calendar.setIcalUrl(event.target.value)}
              placeholder="https:// or webcal://"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <button className="cal-action" type="button" onClick={() => void calendar.connectIcal()}>
            Load iCal link
          </button>
          <p className="cal-hint">
            Apple Calendar has no sign-in API for websites. Publish an iCal link, or subscribe that
            calendar in Google and connect Google instead.
          </p>
        </form>
      ) : null}
      <div className="cal-actions">
        <button className="cal-link" type="button" onClick={() => setSetup((open) => !open)}>
          <CalendarMiniIcon />
          {setup ? 'Hide connect' : connected ? 'Calendar settings' : 'Connect calendar'}
        </button>
        {connected ? (
          <button className="cal-link" type="button" onClick={calendar.disconnect}>
            Disconnect
          </button>
        ) : (
          <ExternalLink className="cal-link" href="https://calendar.google.com">
            Open Google Calendar
          </ExternalLink>
        )}
      </div>
    </section>
  )
}

export function NewsFeed() {
  return (
    <section className="card news-feed">
      <h2 className="card-label">BBC News</h2>
      <div className="stories">
        {stories.map((story) => (
          <ExternalLink
            key={story.title}
            className="story"
            href={`https://www.bbc.com/search?q=${encodeURIComponent(story.title)}`}
          >
            <span className="story-title">{story.title}</span>
            <span className="story-meta">
              <span className="bbc-mark" aria-hidden="true" />
              BBC News
              <span aria-hidden="true">·</span>
              {story.age}
            </span>
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}

export function QuoteCard() {
  return (
    <section className="card quote-card">
      <h2 className="card-label quote-label">
        <SparkleIcon />
        Quote of the day
      </h2>
      <blockquote className="quote-text">“{quote.text}”</blockquote>
      <footer className="quote-footer">
        <cite>— {quote.author}</cite>
        <span className="wisdom">{quote.badge}</span>
      </footer>
    </section>
  )
}

export function DirectionsCard({
  destination,
  onDestination,
  onSubmit,
}: {
  destination: string
  onDestination: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <section className="card directions-card">
      <h2 className="card-label">Directions</h2>
      <p className="address">
        {profile.addressDisplay[0]}
        <br />
        {profile.addressDisplay[1]}
      </p>
      <form onSubmit={onSubmit}>
        <input
          className="where"
          value={destination}
          onChange={(event) => onDestination(event.target.value)}
          placeholder="Where to?"
          aria-label="Destination"
          autoComplete="off"
        />
        <button className="go" type="submit">
          <ArrowIcon />
          Go
        </button>
      </form>
    </section>
  )
}
