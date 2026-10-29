import { useMemo } from 'react'
import { useNow } from './hooks'
import { noticeStats } from './notice'
import { formatHolidayChip, noticeTimeline } from './noticeCalendar'
import { noticePhase, phaseLabel } from './noticeContent'
import { NoticeBalancePanel } from './NoticeBalancePanel'
import { NoticeRunwayHero } from './NoticeRunwayHero'

export function NoticeRail() {
  const now = useNow()
  const stats = useMemo(() => noticeStats(now), [now])
  const phase = noticePhase(stats)
  const dayKey = `${stats.today.getFullYear()}-${stats.today.getMonth() + 1}-${stats.today.getDate()}`
  const timeline = useMemo(() => noticeTimeline(stats), [dayKey, stats.remainingDays])

  const totalDaysLeft = stats.complete ? 0 : stats.remainingDays
  const workingLeft = timeline.remaining.estimatedWorkingDays

  const upcomingHolidays = timeline.remaining.holidays.filter((h) => h.observed)

  return (
    <aside className="rail rail-left notice-rail notice-rail--compact" aria-label="Notice dashboard">
      <header className="notice-dash-head">
        <div>
          <h2 className="notice-dash-title">Exit runway</h2>
          <p className="notice-dash-sub">
            Day {stats.elapsedDays} of {stats.totalDays} · LWD 28 Jan 2027
          </p>
        </div>
        <span className={`notice-phase notice-phase--${phase}`}>{phaseLabel(phase)}</span>
      </header>

      <NoticeRunwayHero
        totalDaysLeft={totalDaysLeft}
        workingLeft={workingLeft}
        progressPercent={stats.progressPercent}
        complete={stats.complete}
      />

      <section className="notice-calendar-open" aria-labelledby="notice-calendar-heading">
        <h3 className="notice-panel-title" id="notice-calendar-heading">
          Sat · Sun · holidays
        </h3>
        <p className="notice-calendar-lead notice-calendar-lead--compact">
          {timeline.saturdays} Sat, {timeline.sundays} Sun ({timeline.weekendDays} weekend days) · ~
          {timeline.estimatedWorkingDays} working in runway
        </p>
        <ul className="notice-holiday-list notice-holiday-list--rail">
          {upcomingHolidays.map((h) => (
            <li key={h.iso} className="notice-holiday">
              <span className="notice-holiday-date">{formatHolidayChip(h)}</span>
              <span className="notice-holiday-name">{h.name}</span>
              {h.onWeekend ? (
                <span className="notice-holiday-tag">Weekend</span>
              ) : (
                <span className="notice-holiday-tag notice-holiday-tag--off">Off</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <NoticeBalancePanel totalDaysLeft={totalDaysLeft} timeline={timeline} />
    </aside>
  )
}
