import { formatHolidayChip, type NoticeTimeline } from './noticeCalendar'

type NoticeBalancePanelProps = {
  totalDaysLeft: number
  timeline: NoticeTimeline
}

export function NoticeBalancePanel({ totalDaysLeft, timeline }: NoticeBalancePanelProps) {
  const weeksLeft = Math.max(0, Math.ceil(totalDaysLeft / 7))
  const nextOff =
    timeline.remaining.holidays.find((h) => h.observed && !h.onWeekend) ??
    timeline.remaining.holidays.find((h) => h.observed)

  return (
    <section className="notice-balance" aria-label="Runway ahead">
      <div className="notice-balance-banner">
        <img
          className="notice-balance-banner-art"
          src={`${import.meta.env.BASE_URL}runway-anime.svg`}
          alt=""
          decoding="async"
        />
        <p className="notice-balance-banner-copy">
          <span className="notice-balance-scenic-kicker">Runway ahead</span>
          <span className="notice-balance-scenic-date">Wheels up · 28 Jan 2027</span>
        </p>
      </div>

      <dl className="notice-balance-facts">
        <div className="notice-balance-fact">
          <dt>Weeks left</dt>
          <dd>{weeksLeft}</dd>
        </div>
        <div className="notice-balance-fact">
          <dt>Next day off</dt>
          <dd>{nextOff ? formatHolidayChip(nextOff) : '—'}</dd>
        </div>
        <div className="notice-balance-fact">
          <dt>Working left</dt>
          <dd>~{timeline.remaining.estimatedWorkingDays}</dd>
        </div>
      </dl>
    </section>
  )
}
