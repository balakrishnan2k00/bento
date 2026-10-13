import { useEffect, useState } from 'react'
import { fallbackQuote, profile } from './data'

export function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return now
}

export function useWeather() {
  const [temp, setTemp] = useState(32)
  const [code, setCode] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      latitude: String(profile.latitude),
      longitude: String(profile.longitude),
      current: 'temperature_2m,weather_code',
      temperature_unit: 'celsius',
    })

    fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { current?: { temperature_2m?: number; weather_code?: number } }) => {
        if (typeof data.current?.temperature_2m === 'number') {
          setTemp(Math.round(data.current.temperature_2m))
        }
        if (typeof data.current?.weather_code === 'number') {
          setCode(data.current.weather_code)
        }
      })
      .catch(() => undefined)

    return () => controller.abort()
  }, [])

  return { temp, code }
}

export function useSearchHotkey() {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return
      event.preventDefault()
      document.getElementById('dashboard-search')?.focus()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

type DailyQuote = {
  text: string
  author: string
}

function quoteKey(now: Date) {
  return `bento.quote.${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

function readCachedQuote(now: Date): DailyQuote | null {
  const raw = localStorage.getItem(quoteKey(now))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as DailyQuote
    if (parsed.text && parsed.author) return parsed
  } catch {
    return null
  }
  return null
}

async function fetchRemoteQuote(signal: AbortSignal): Promise<DailyQuote> {
  const response = await fetch('https://dummyjson.com/quotes/random', { signal })
  if (!response.ok) throw new Error('quote')
  const data = (await response.json()) as { quote?: string; author?: string }
  if (!data.quote || !data.author) throw new Error('quote')
  return { text: data.quote, author: data.author }
}

export function useQuote(now: Date) {
  const dayStamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
  const [year, month, day] = dayStamp.split('-').map(Number)
  const cached = readCachedQuote(new Date(year, month, day))
  const [remote, setRemote] = useState<DailyQuote | null>(null)

  useEffect(() => {
    const [y, m, d] = dayStamp.split('-').map(Number)
    const when = new Date(y, m, d)
    if (readCachedQuote(when)) return

    const controller = new AbortController()
    fetchRemoteQuote(controller.signal)
      .then((next) => {
        localStorage.setItem(quoteKey(when), JSON.stringify(next))
        setRemote(next)
      })
      .catch(() => setRemote(fallbackQuote))

    return () => controller.abort()
  }, [dayStamp])

  return cached ?? remote ?? fallbackQuote
}
