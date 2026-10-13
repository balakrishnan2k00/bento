import type { ScheduleEvent } from './data'
import { formatClock } from './format'

export type CalendarSource = 'demo' | 'google' | 'ical'

const CLIENT_ID_KEY = 'bento.googleClientId'
const SOURCE_KEY = 'bento.calendarSource'
const ICAL_KEY = 'bento.icalUrl'
const TOKEN_KEY = 'bento.googleToken'

const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly'

type TokenRecord = {
  accessToken: string
  expiresAt: number
}

type GoogleEvent = {
  summary?: string
  start?: { date?: string; dateTime?: string }
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token?: string; expires_in?: number; error?: string }) => void
          }) => { requestAccessToken: (opts?: { prompt?: string }) => void }
          revoke: (token: string, done: () => void) => void
        }
      }
    }
  }
}

export function loadClientId() {
  return localStorage.getItem(CLIENT_ID_KEY)?.trim() ?? import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() ?? ''
}

export function saveClientId(id: string) {
  localStorage.setItem(CLIENT_ID_KEY, id.trim())
}

export function loadSource(): CalendarSource {
  const value = localStorage.getItem(SOURCE_KEY)
  if (value === 'google' || value === 'ical' || value === 'demo') return value
  return 'demo'
}

export function saveSource(source: CalendarSource) {
  localStorage.setItem(SOURCE_KEY, source)
}

export function loadIcalUrl() {
  return localStorage.getItem(ICAL_KEY)?.trim() ?? ''
}

export function saveIcalUrl(url: string) {
  localStorage.setItem(ICAL_KEY, url.trim())
}

export function clearGoogleToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

function readToken(): TokenRecord | null {
  const raw = sessionStorage.getItem(TOKEN_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as TokenRecord
    if (!parsed.accessToken || parsed.expiresAt <= Date.now() + 30_000) return null
    return parsed
  } catch {
    return null
  }
}

function writeToken(accessToken: string, expiresIn: number) {
  const record: TokenRecord = {
    accessToken,
    expiresAt: Date.now() + expiresIn * 1000,
  }
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(record))
}

function dayBounds(now: Date) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { start, end }
}

function toEvent(title: string, time: string): ScheduleEvent {
  return { title: title || '(No title)', time }
}

function formatGoogleTime(event: GoogleEvent) {
  if (event.start?.date && !event.start.dateTime) return 'All day'
  if (!event.start?.dateTime) return ''
  return formatClock(new Date(event.start.dateTime))
}

export async function loadGis() {
  if (window.google?.accounts.oauth2) return
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-bento-gis]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Could not load Google sign-in.')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.dataset.bentoGis = 'true'
    script.addEventListener('load', () => resolve())
    script.addEventListener('error', () => reject(new Error('Could not load Google sign-in.')))
    document.head.appendChild(script)
  })
}

export function requestGoogleToken(clientId: string, prompt: '' | 'consent') {
  return new Promise<string>((resolve, reject) => {
    const client = window.google?.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: CALENDAR_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error || 'Google sign-in was cancelled.'))
          return
        }
        writeToken(response.access_token, response.expires_in ?? 3600)
        resolve(response.access_token)
      },
    })
    if (!client) {
      reject(new Error('Google sign-in is not ready yet.'))
      return
    }
    client.requestAccessToken({ prompt })
  })
}

export async function fetchGoogleEvents(now: Date, token?: string) {
  const accessToken = token ?? readToken()?.accessToken
  if (!accessToken) throw new Error('Connect Google Calendar to load today’s events.')
  const { start, end } = dayBounds(now)
  const params = new URLSearchParams({
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '12',
  })
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  )
  if (response.status === 401) {
    clearGoogleToken()
    throw new Error('Google sign-in expired. Connect again.')
  }
  if (!response.ok) throw new Error('Could not read Google Calendar.')
  const data = (await response.json()) as { items?: GoogleEvent[] }
  return (data.items ?? []).map((item) => toEvent(item.summary ?? '', formatGoogleTime(item)))
}

export function disconnectGoogle() {
  const token = readToken()?.accessToken
  if (token && window.google?.accounts.oauth2) {
    window.google.accounts.oauth2.revoke(token, () => undefined)
  }
  clearGoogleToken()
}

export function normalizeIcalUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return ''
  return trimmed.replace(/^webcal:/i, 'https:')
}

function unfoldIcal(text: string) {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '')
}

function parseIcsDate(raw: string) {
  const [meta, value] = raw.includes(':') ? [raw.slice(0, raw.indexOf(':')), raw.slice(raw.indexOf(':') + 1)] : ['', raw]
  const stamp = value.trim()
  if (meta.includes('VALUE=DATE') || /^\d{8}$/.test(stamp)) {
    const year = Number(stamp.slice(0, 4))
    const month = Number(stamp.slice(4, 6)) - 1
    const day = Number(stamp.slice(6, 8))
    return { date: new Date(year, month, day), allDay: true }
  }
  const match = stamp.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/)
  if (!match) return null
  const [, year, month, day, hour, minute, second, zulu] = match
  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${zulu ? 'Z' : ''}`
  return { date: new Date(iso), allDay: false }
}

function icsField(block: string, name: string) {
  const line = block.split('\n').find((entry) => entry.startsWith(`${name}:`) || entry.startsWith(`${name};`))
  return line ?? ''
}

export function parseIcalEvents(ics: string, now: Date) {
  const { start, end } = dayBounds(now)
  const blocks = unfoldIcal(ics).split('BEGIN:VEVENT').slice(1)
  const events: ScheduleEvent[] = []

  for (const chunk of blocks) {
    const block = chunk.split('END:VEVENT')[0] ?? ''
    const dtstart = parseIcsDate(icsField(block, 'DTSTART'))
    if (!dtstart) continue
    if (dtstart.date < start || dtstart.date >= end) continue
    const summary = icsField(block, 'SUMMARY').replace(/^SUMMARY[^:]*:/, '') || '(No title)'
    events.push(toEvent(summary, dtstart.allDay ? 'All day' : formatClock(dtstart.date)))
  }

  return events.slice(0, 12)
}

export async function fetchIcalEvents(url: string, now: Date) {
  const href = normalizeIcalUrl(url)
  if (!href) throw new Error('Paste an iCal link from Apple or Google Calendar.')
  let response: Response
  try {
    response = await fetch(href)
  } catch {
    throw new Error(
      'This calendar link cannot be read in the browser. Sync it into Google Calendar, then connect Google.',
    )
  }
  if (!response.ok) throw new Error('Could not load that iCal link.')
  const text = await response.text()
  if (!text.includes('BEGIN:VCALENDAR')) throw new Error('That link does not look like an iCal calendar.')
  return parseIcalEvents(text, now)
}
