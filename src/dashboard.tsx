import type { FormEvent, ReactNode } from 'react'
import type { Bookmark } from './data'
import { profile } from './data'
import { formatClock, formatPillDate, greetingFor } from './format'
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
import { ThemeToggle } from './ThemeToggle'
import type { ThemePreference } from './theme'

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

export function TopBar({
  now,
  temp,
  code,
  themePreference,
  onThemePreference,
}: {
  now: Date
  temp: number
  code: number
  themePreference: ThemePreference
  onThemePreference: (value: ThemePreference) => void
}) {
  return (
    <div className="shell-head">
      <h1 className="greeting">
        <Flag />
        {greetingFor(now)}, {profile.name}
      </h1>
      <div className="pills">
        <span className="pill pill-theme" title="Appearance">
          <ThemeToggle value={themePreference} onChange={onThemePreference} />
        </span>
        <span className="pill">
          <ClockIcon />
          {formatClock(now)}
        </span>
        <span className="pill">
          <CalendarMiniIcon />
          {formatPillDate(now)}
        </span>
        <span className="pill" title="Hyderabad, India">
          <WeatherIcon code={code} />
          {temp}°C
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
  engine: 'google' | 'bing'
  onQuery: (value: string) => void
  onEngine: (engine: 'google' | 'bing') => void
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
          aria-checked={engine === 'bing'}
          onClick={() => onEngine('bing')}
        >
          Bing
        </button>
      </div>
    </form>
  )
}

export function LinkCard({
  title,
  items,
  groups,
  className,
}: {
  title: string
  items?: Bookmark[]
  groups?: { label?: string; items: Bookmark[] }[]
  className?: string
}) {
  const sections = groups ?? [{ items: items ?? [] }]

  return (
    <section className={`card ${className ?? ''}`}>
      <h2 className="card-label">{title}</h2>
      <nav className="link-list" aria-label={title}>
        {sections.map((section, index) => (
          <div key={section.label ?? `section-${index}`} className="link-section">
            {section.label ? <h3 className="link-section-label">{section.label}</h3> : null}
            {section.items.map((item) => (
              <ExternalLink key={item.label} className="link-row" href={item.href}>
                <ServiceIcon name={item.icon} href={item.href} />
                <span>{item.label}</span>
                <Chevron />
              </ExternalLink>
            ))}
          </div>
        ))}
      </nav>
    </section>
  )
}

export function QuoteCard({ text, author }: { text: string; author: string }) {
  return (
    <section className="card quote-card">
      <span className="quote-mark" aria-hidden="true">
        “
      </span>
      <div className="quote-copy">
        <h2 className="card-label quote-label">
          <SparkleIcon />
          Quote of the day
        </h2>
        <blockquote className="quote-text">{text}</blockquote>
      </div>
      <footer className="quote-footer">
        <cite>— {author}</cite>
        <span className="wisdom">Daily Wisdom</span>
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
        <button className="go" type="submit" aria-label="Get directions">
          <ArrowIcon />
          <span className="go-text">Go</span>
        </button>
      </form>
    </section>
  )
}
