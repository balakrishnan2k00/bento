import { type DailyCopy } from './noticeContent'

export function NoticeToday({
  daily,
  placement = 'left',
}: {
  daily: DailyCopy
  placement?: 'left' | 'right'
}) {
  const isRight = placement === 'right'

  return (
    <section
      className={`notice-today${isRight ? ' notice-today--right' : ''}`}
      aria-labelledby="notice-daily-heading"
    >
      <div className="notice-today-head">
        <h3 className="notice-today-title" id="notice-daily-heading">
          Today
        </h3>
        <span className="notice-day-chip">{daily.dayLabel}</span>
      </div>
      <blockquote className="notice-today-thought">{daily.thought}</blockquote>
      {!isRight ? (
        <div className="notice-today-fill" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}exit-runway-fill.svg`} alt="" decoding="async" />
        </div>
      ) : null}
      <div className="notice-today-actions">
        <p className="notice-today-row notice-today-row--do">
          <span className="notice-today-tag">Do</span>
          <span className="notice-today-text">{daily.push}</span>
        </p>
        <p className="notice-today-row notice-today-row--move">
          <span className="notice-today-tag">Move</span>
          <span className="notice-today-text">{daily.move}</span>
        </p>
      </div>
    </section>
  )
}
