import { noticePeriod, parseNoticeDate, startOfLocalDay, type NoticeStats } from './notice'

export type HolidayDef = {
  date: string
  name: string
  /** Telangana / common Hyderabad IT calendar — toggle in data if your employer differs. */
  observed: boolean
}

/**
 * Public holidays between notice start and last working day (Hyderabad / Telangana oriented).
 * Edit `observed` if your company skips optional days (e.g. New Year).
 */
export const noticeHolidayCalendar: HolidayDef[] = [
  { date: '2026-11-08', name: 'Diwali (Deepavali)', observed: true },
  { date: '2026-11-24', name: 'Guru Nanak Jayanti', observed: true },
  { date: '2026-12-25', name: 'Christmas', observed: true },
  { date: '2026-12-26', name: 'Boxing Day', observed: true },
  { date: '2027-01-01', name: 'New Year', observed: false },
  { date: '2027-01-14', name: 'Bhogi', observed: true },
  { date: '2027-01-15', name: 'Sankranti / Pongal', observed: true },
  { date: '2027-01-16', name: 'Kanuma', observed: true },
  { date: '2027-01-26', name: 'Republic Day', observed: true },
]

export type HolidayInTimeline = {
  date: Date
  iso: string
  name: string
  weekday: string
  onWeekend: boolean
  observed: boolean
  /** Weekday that is a public holiday (not Sat/Sun). */
  extraOff: boolean
}

export type NoticeTimeline = {
  calendarDays: number
  saturdays: number
  sundays: number
  weekendDays: number
  holidays: HolidayInTimeline[]
  observedHolidayWeekdays: number
  observedHolidayOnWeekends: number
  /** Calendar days minus weekends minus weekday public holidays (observed). */
  estimatedWorkingDays: number
  /** Same breakdown from today through last working day (inclusive). */
  remaining: {
    calendarDays: number
    weekendDays: number
    saturdays: number
    sundays: number
    observedHolidayWeekdays: number
    estimatedWorkingDays: number
    holidays: HolidayInTimeline[]
  }
}

function weekdayShort(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date)
}

function eachDayInclusive(from: Date, to: Date, fn: (day: Date) => void) {
  const cursor = startOfLocalDay(from)
  const end = startOfLocalDay(to)
  while (cursor.getTime() <= end.getTime()) {
    fn(cursor)
    cursor.setDate(cursor.getDate() + 1)
  }
}

function holidaysInRange(from: Date, to: Date): HolidayInTimeline[] {
  const fromMs = startOfLocalDay(from).getTime()
  const toMs = startOfLocalDay(to).getTime()
  const out: HolidayInTimeline[] = []

  for (const entry of noticeHolidayCalendar) {
    const date = startOfLocalDay(parseNoticeDate(entry.date))
    const ms = date.getTime()
    if (ms < fromMs || ms > toMs) continue
    const dow = date.getDay()
    const onWeekend = dow === 0 || dow === 6
    const observed = entry.observed
    out.push({
      date,
      iso: entry.date,
      name: entry.name,
      weekday: weekdayShort(date),
      onWeekend,
      observed,
      extraOff: observed && !onWeekend,
    })
  }

  out.sort((a, b) => a.date.getTime() - b.date.getTime())
  return out
}

function countWeekends(from: Date, to: Date): { saturdays: number; sundays: number } {
  let saturdays = 0
  let sundays = 0
  eachDayInclusive(from, to, (day) => {
    const dow = day.getDay()
    if (dow === 6) saturdays += 1
    if (dow === 0) sundays += 1
  })
  return { saturdays, sundays }
}

function summarizeRange(from: Date, to: Date) {
  const calendarDays =
    Math.floor((startOfLocalDay(to).getTime() - startOfLocalDay(from).getTime()) / 86_400_000) + 1
  const { saturdays, sundays } = countWeekends(from, to)
  const weekendDays = saturdays + sundays
  const holidays = holidaysInRange(from, to)
  const observedHolidayWeekdays = holidays.filter((h) => h.extraOff).length
  const observedHolidayOnWeekends = holidays.filter((h) => h.observed && h.onWeekend).length
  const estimatedWorkingDays = Math.max(0, calendarDays - weekendDays - observedHolidayWeekdays)

  return {
    calendarDays,
    saturdays,
    sundays,
    weekendDays,
    holidays,
    observedHolidayWeekdays,
    observedHolidayOnWeekends,
    estimatedWorkingDays,
  }
}

export function noticeTimeline(_stats?: NoticeStats): NoticeTimeline {
  const start = startOfLocalDay(parseNoticeDate(noticePeriod.startDate))
  const end = startOfLocalDay(parseNoticeDate(noticePeriod.lastWorkingDay))
  const today = _stats ? startOfLocalDay(_stats.today) : startOfLocalDay(new Date())

  const full = summarizeRange(start, end)
  const remainingFrom = today.getTime() < start.getTime() ? start : today
  const remaining = summarizeRange(remainingFrom, end)

  return {
    ...full,
    remaining: {
      calendarDays: remaining.calendarDays,
      weekendDays: remaining.weekendDays,
      saturdays: remaining.saturdays,
      sundays: remaining.sundays,
      observedHolidayWeekdays: remaining.observedHolidayWeekdays,
      estimatedWorkingDays: remaining.estimatedWorkingDays,
      holidays: remaining.holidays,
    },
  }
}

export function formatHolidayChip(h: HolidayInTimeline): string {
  const day = h.date.getDate()
  const mon = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(h.date)
  return `${h.weekday} ${day} ${mon}`
}
