export const noticePeriod = {
  durationDays: 90,
  /** Notice start (local calendar date). */
  startDate: '2026-10-30',
  /** Last working day — 28 Jan 2027. */
  lastWorkingDay: '2027-01-28',
}

export function parseNoticeDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export { startOfLocalDay }

export type NoticeStats = {
  start: Date
  end: Date
  today: Date
  elapsedDays: number
  remainingDays: number
  progressPercent: number
  complete: boolean
  totalDays: number
}

export function noticeStats(now: Date): NoticeStats {
  const start = startOfLocalDay(parseNoticeDate(noticePeriod.startDate))
  const end = startOfLocalDay(parseNoticeDate(noticePeriod.lastWorkingDay))
  const today = startOfLocalDay(now)
  const msDay = 86_400_000

  const totalDays = noticePeriod.durationDays
  const elapsedDays = Math.min(
    totalDays,
    Math.max(0, Math.floor((today.getTime() - start.getTime()) / msDay) + 1),
  )
  const remainingDays = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / msDay))
  const progressPercent = Math.min(100, Math.round((elapsedDays / totalDays) * 100))
  const complete = today.getTime() > end.getTime()

  return {
    start,
    end,
    today,
    elapsedDays,
    remainingDays,
    progressPercent,
    complete,
    totalDays,
  }
}
