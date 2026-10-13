import { useCallback, useEffect, useState } from 'react'
import {
  disconnectGoogle,
  fetchGoogleEvents,
  fetchIcalEvents,
  loadClientId,
  loadGis,
  loadIcalUrl,
  loadSource,
  requestGoogleToken,
  saveClientId,
  saveIcalUrl,
  saveSource,
  type CalendarSource,
} from './calendar'
import { profile, schedule } from './data'
import type { ScheduleEvent } from './data'

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

export function useCalendar(now: Date) {
  const [source, setSource] = useState<CalendarSource>(loadSource)
  const [events, setEvents] = useState<ScheduleEvent[]>(source === 'demo' ? schedule : [])
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState('')
  const [clientId, setClientId] = useState(loadClientId)
  const [icalUrl, setIcalUrl] = useState(loadIcalUrl)

  const dayStamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`

  const refresh = useCallback(async () => {
    const [year, month, day] = dayStamp.split('-').map(Number)
    const when = new Date(year, month, day)
    if (source === 'demo') {
      setEvents(schedule)
      setError('')
      return
    }
    setStatus('loading')
    setError('')
    try {
      let next
      if (source === 'google') {
        const id = loadClientId()
        if (!id) throw new Error('Add a Google OAuth client ID first. See the README.')
        try {
          next = await fetchGoogleEvents(when)
        } catch {
          await loadGis()
          await requestGoogleToken(id, '')
          next = await fetchGoogleEvents(when)
        }
      } else {
        next = await fetchIcalEvents(icalUrl, when)
      }
      setEvents(next)
    } catch (caught) {
      setEvents([])
      setError(caught instanceof Error ? caught.message : 'Could not load calendar.')
    } finally {
      setStatus('idle')
    }
  }, [dayStamp, icalUrl, source])

  useEffect(() => {
    if (source === 'demo') return
    void refresh()
  }, [refresh, source])

  async function connectGoogle() {
    const id = clientId.trim()
    if (!id) {
      setError('Add a Google OAuth client ID first. See the README.')
      return
    }
    saveClientId(id)
    setStatus('loading')
    setError('')
    try {
      await loadGis()
      await requestGoogleToken(id, 'consent')
      saveSource('google')
      setSource('google')
      setEvents(await fetchGoogleEvents(now))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Google sign-in failed.')
    } finally {
      setStatus('idle')
    }
  }

  async function connectIcal() {
    const url = icalUrl.trim()
    if (!url) {
      setError('Paste an iCal URL from Apple Calendar or Google Calendar.')
      return
    }
    saveIcalUrl(url)
    setStatus('loading')
    setError('')
    try {
      const next = await fetchIcalEvents(url, now)
      saveSource('ical')
      setSource('ical')
      setEvents(next)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load that iCal link.')
    } finally {
      setStatus('idle')
    }
  }

  function disconnect() {
    if (source === 'google') disconnectGoogle()
    saveSource('demo')
    setSource('demo')
    setEvents(schedule)
    setError('')
  }

  return {
    source,
    events,
    status,
    error,
    clientId,
    icalUrl,
    setClientId,
    setIcalUrl,
    connectGoogle,
    connectIcal,
    disconnect,
  }
}
