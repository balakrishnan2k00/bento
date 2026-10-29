type NoticeRunwayHeroProps = {
  totalDaysLeft: number
  workingLeft: number
  progressPercent: number
  complete: boolean
}

const RING_R = 46
const RING_C = 2 * Math.PI * RING_R

export function NoticeRunwayHero({
  totalDaysLeft,
  workingLeft,
  progressPercent,
  complete,
}: NoticeRunwayHeroProps) {
  const served = Math.min(100, Math.max(0, progressPercent))
  const ringDash = (RING_C * served) / 100
  const centerLabel = complete ? 'Done' : totalDaysLeft === 1 ? 'day to go' : 'days to go'

  return (
    <div
      className="runway-gauge"
      role="group"
      aria-label={
        complete
          ? 'Notice period complete'
          : `${totalDaysLeft} total days left, ${served} percent of notice served, about ${workingLeft} working days left`
      }
    >
      <div className="runway-gauge-ring">
        <svg className="runway-gauge-svg" viewBox="0 0 112 112" aria-hidden="true">
          <defs>
            <linearGradient id="runwayRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          <circle
            className="runway-gauge-track"
            cx="56"
            cy="56"
            r={RING_R}
            fill="none"
            strokeWidth="7"
          />
          <circle
            className="runway-gauge-progress"
            cx="56"
            cy="56"
            r={RING_R}
            fill="none"
            stroke="url(#runwayRingGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${ringDash} ${RING_C}`}
            transform="rotate(-90 56 56)"
          />
        </svg>
        <div className="runway-gauge-core">
          <span className="runway-gauge-num">{complete ? '0' : totalDaysLeft}</span>
          <span className="runway-gauge-unit">{centerLabel}</span>
        </div>
      </div>

      <div className="runway-strip" aria-hidden="true">
        <span className="runway-strip-label">Now</span>
        <div className="runway-strip-track">
          <div className="runway-strip-fill" style={{ width: `${served}%` }} />
          <span className="runway-strip-plane" style={{ left: `clamp(4px, ${served}%, calc(100% - 4px))` }}>
            ✈
          </span>
        </div>
        <span className="runway-strip-label">28 Jan</span>
      </div>

      <div className="runway-gauge-foot">
        <span className="runway-chip runway-chip--work">~{workingLeft} work days</span>
        <span className="runway-chip runway-chip--served">{served}% flown</span>
      </div>
    </div>
  )
}
