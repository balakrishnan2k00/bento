import { useEffect, useState } from 'react'
import { profile } from './data'

export function useNow() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return now
}

export function useWeather() {
  const [temp, setTemp] = useState(79)
  const [code, setCode] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      latitude: String(profile.latitude),
      longitude: String(profile.longitude),
      current: 'temperature_2m,weather_code',
      temperature_unit: 'fahrenheit',
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
