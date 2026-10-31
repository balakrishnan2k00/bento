import { useState } from 'react'
import type { FormEvent } from 'react'
import { entertainment, favoriteGroups, personal, profile, work } from './data'
import {
  DirectionsCard,
  LinkCard,
  QuoteCard,
  SearchBar,
  TopBar,
} from './dashboard'
import { Logo } from './icons'
import { useNow, useQuote, useSearchHotkey, useThemeControl, useWeather } from './hooks'
import { NoticeRail } from './NoticeRail'
import { MovieTimeline } from './MovieTimeline'

type Engine = 'google' | 'bing'

export default function App() {
  const now = useNow()
  const { preference: themePreference, setPreference: setThemePreference } = useThemeControl(now)
  const weather = useWeather()
  const quote = useQuote(now)
  const [engine, setEngine] = useState<Engine>('google')
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState('')
  useSearchHotkey()

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const url =
      engine === 'google'
        ? `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
        : `https://www.bing.com/search?q=${encodeURIComponent(trimmed)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function onDirections(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const origin = encodeURIComponent(profile.address)
    const trimmed = destination.trim()
    const url = trimmed
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(trimmed)}`
      : `https://www.google.com/maps/search/?api=1&query=${origin}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="scene">
      <div className="backdrop" aria-hidden="true">
        <div className="orb orb-sun" />
        <div className="orb orb-peach" />
        <div className="orb orb-mint" />
        <div className="orb orb-sky" />
        <div className="orb orb-foam" />
        <div className="haze" />
      </div>
      <Plant />
      <div className="page">
        <NoticeRail />
        <div className="page-center">
          <main className="shell">
            <TopBar
            now={now}
            temp={weather.temp}
            code={weather.code}
            themePreference={themePreference}
            onThemePreference={setThemePreference}
          />
            <div className="shell-top">
              <div className="brand brand--inline" aria-label="Prism">
                <Logo />
                <span className="wordmark">Prism</span>
              </div>
              <SearchBar
                query={query}
                engine={engine}
                onQuery={setQuery}
                onEngine={setEngine}
                onSubmit={onSearch}
              />
            </div>
            <QuoteCard text={quote.text} author={quote.author} />
            <section className="bento" aria-label="Dashboard">
              <LinkCard className="personal" title="Personal" items={personal} />
              <LinkCard className="favorites" title="Favorites" groups={favoriteGroups} />
              <LinkCard className="entertainment" title="Entertainment" items={entertainment} />
              <DirectionsCard
                destination={destination}
                onDestination={setDestination}
                onSubmit={onDirections}
              />
              <LinkCard className="work" title="Work" items={work} />
            </section>
          </main>
        </div>
        <MovieTimeline />
      </div>
    </div>
  )
}

function Plant() {
  return (
    <svg className="plant" viewBox="0 0 220 320" aria-hidden="true">
      <ellipse cx="110" cy="292" rx="46" ry="10" fill="rgba(120,140,150,0.18)" />
      <path d="M86 250h48l8 36H78l8-36z" fill="#f7f8fa" />
      <path d="M92 250h36l4 18H88l4-18z" fill="#ece7df" />
      <path d="M110 250c-2-40 8-70 8-108" fill="none" stroke="#6d8f72" strokeWidth="4" />
      <path d="M110 200c-28-10-58-6-78 16 24 6 48 4 78-16z" fill="#7ea888" />
      <path d="M112 176c30-18 62-8 78 18-28 2-52-2-78-18z" fill="#8fb896" />
      <path d="M108 150c-34-28-20-70 8-78 2 28-2 52-8 78z" fill="#6f9a7c" />
      <path d="M114 132c28-34 64-24 74-2-30 8-52 10-74 2z" fill="#9dc7a4" />
      <path d="M108 108c-18-36 8-62 28-58-6 24-14 40-28 58z" fill="#5f8d6c" />
    </svg>
  )
}
