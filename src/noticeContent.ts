import { noticePeriod, parseNoticeDate, type NoticeStats } from './notice'

export type NoticePhase = 'ramp' | 'build' | 'close'

export function noticePhase(stats: NoticeStats): NoticePhase {
  if (stats.elapsedDays <= 30) return 'ramp'
  if (stats.elapsedDays <= 60) return 'build'
  return 'close'
}

export function phaseLabel(phase: NoticePhase): string {
  if (phase === 'ramp') return 'Ramp-down'
  if (phase === 'build') return 'Build next'
  return 'Close-out'
}

/** Stable index from calendar date + salt — changes at local midnight. */
function calendarSeed(date: Date, salt = 0): number {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return (y * 372 + m * 31 + d + salt) >>> 0
}

function pickOne<T>(items: readonly T[], date: Date, salt: number): T {
  const index = calendarSeed(date, salt) % items.length
  return items[index]!
}

function pickMany<T>(items: readonly T[], date: Date, count: number, salt: number): T[] {
  if (items.length <= count) return [...items]
  const picked: T[] = []
  const used = new Set<number>()
  let seed = calendarSeed(date, salt)
  while (picked.length < count && used.size < items.length) {
    const index = seed % items.length
    seed = (seed * 1_103_515_245 + 12_345) >>> 0
    if (used.has(index)) continue
    used.add(index)
    picked.push(items[index]!)
  }
  return picked
}

const thoughts = [
  'Freedom on 28 Jan is built in small, honest hours — not heroic all-nighters.',
  'You are serving notice, not serving anxiety. Breathe between tickets.',
  'The best revenge against burnout is a calm, competent exit.',
  'Your identity outlives this badge. Invest in who you become next.',
  'Consistency beats intensity when the runway is ninety days long.',
  'People remember how you left more than how busy you looked leaving.',
  'Today’s mood is not tomorrow’s contract. Show up anyway.',
  'Rest is part of the plan, not a reward you earn at the end.',
  'Clarity for your team now is kindness for your reputation later.',
  'You don’t need permission to start becoming who you wanted to be.',
  'Notice period is a bridge — walk it; don’t sprint off the edge.',
  'Energy is finite. Spend it on handover, health, and hope.',
  'Every “no” to noise is a “yes” to your next chapter.',
  'Hyderabad heat breaks for everyone — including you. Hydrate.',
  'The countdown is real; so is your worth outside this org.',
  'Finish strong enough to be proud, light enough to leave.',
  'Skills compound in quiet blocks. Protect one today.',
  'You already made the hard decision. Now execute with grace.',
  'Worry rehearses failure; preparation prevents it.',
  '28 Jan is a date on a calendar. The life after is the point.',
  'Compare yourself to who you were last week, not to coworkers.',
  'A ten-minute walk is a vote for future-you.',
  'Document today what future-you will forget in a month.',
  'Network like a human, not like a transaction.',
  'This chapter ends. Your story doesn’t.',
  'Steady beats flashy when the timeline is three months.',
  'You owe professionalism, not your soul.',
  'Celebrate micro-wins — they stack into momentum.',
  'Leave the desk clearer than you found it, inside and out.',
  'Tomorrow’s thought is fresh. Today, do one thing that matters.',
]

const pushes = [
  'Block 45 minutes for handover writing before lunch.',
  'Send one update your manager actually needs — not noise.',
  'Close three loose threads in Jira or email before EOD.',
  'Say no to one meeting that doesn’t need you.',
  'Update a single CV bullet with a measurable win.',
  'Message one mentor or peer you trust.',
  'Review exit checklist items — tick one off.',
  'Prep talking points for tomorrow’s sync in five bullets.',
  'Back up personal notes from work systems (policy-safe).',
  'List three systems only you touch — start documenting #1.',
  'Do one mock interview question out loud.',
  'Ship a tiny portfolio tweak — deploy or commit.',
  'Clear Slack DMs that are really tasks in disguise.',
  'Schedule tomorrow’s deep-work block on your calendar.',
  'Thank someone who made your tenure better.',
  'Audit passwords and personal accounts — not on work Wi‑Fi.',
  'Read one job description and highlight gaps honestly.',
  'Walk while planning your week — movement + clarity.',
  'File expenses or HR forms before they pile up.',
  'Turn one tribal-knowledge call into written steps.',
  'Set a hard stop time tonight and honor it.',
  'Practice a two-minute “what I did here” story.',
  'Declutter desktop and downloads — mental space matters.',
  'Choose tomorrow’s outfit and lunch — reduce friction.',
  'Spend 20 minutes on learning, not scrolling.',
  'Write the email you’d send on your last day — draft only.',
  'Check notice-day count against HR — sanity check.',
  'Organize files for whoever inherits your work.',
  'Celebrate one thing that went well this week.',
  'Plan one fun thing for the weekend — non-negotiable.',
]

const workoutCues = [
  '10-minute walk after your last call.',
  '20 bodyweight squats + shoulder rolls between meetings.',
  'Stairs instead of lift once today.',
  '10-minute mobility / yoga before dinner.',
  'Walk during an audio-only standup.',
  'Plank 3×30s — quick energy reset.',
  'Neck and wrist stretches every hour on the hour.',
  'Evening walk around the block — phone on DND.',
  '15-minute dumbbell or band session at home.',
  'Dance to two songs while cooking.',
  'Park farther or get off one stop early.',
  'Wall sit 3×40s while water boils.',
  'Sun salutations ×5 after waking up.',
  'Jump rope or imaginary rope — 3 minutes.',
  'Stretch hip flexors — desk life tax.',
  'Push-ups to failure (knee OK) once today.',
  'Balance: single-leg stand while brushing teeth.',
  'Cooldown walk after dinner — aid sleep.',
  'Take calls standing for the first 15 minutes.',
  'Foam roll or tennis ball on shoulders — 5 min.',
]

type FocusItem = { title: string; detail: string }

const focusPools: Record<NoticePhase, FocusItem[]> = {
  ramp: [
    { title: 'Handover list', detail: 'Write what only you know — systems, contacts, quirks.' },
    { title: 'Calendar hygiene', detail: 'Decline noise; protect deep work for transfer.' },
    { title: 'Manager sync', detail: 'Align expectations for the 90-day runway.' },
    { title: 'Access map', detail: 'List tools, repos, and who needs access when you go.' },
    { title: 'Runbook draft', detail: 'One recurring process documented end-to-end.' },
    { title: 'Stakeholder ping', detail: 'Tell partners who covers what after you.' },
    { title: 'Ticket triage', detail: 'Close or reassign — don’t hoard work.' },
    { title: 'Knowledge base', detail: 'Turn a Slack thread into a searchable note.' },
    { title: 'On-call notes', detail: 'If you carry a pager, train your backup.' },
  ],
  build: [
    { title: 'Portfolio / CV', detail: 'One bullet improved beats ten tabs open.' },
    { title: 'Skill block', detail: '45 min learning — course, side project, or cert.' },
    { title: 'Network ping', detail: 'One genuine message to someone you respect.' },
    { title: 'Job pipeline', detail: 'Apply or bookmark three roles — action, not browsing.' },
    { title: 'Mock interview', detail: 'One behavioral question, answered out loud.' },
    { title: 'GitHub green', detail: 'Commit something small but public-safe.' },
    { title: 'LinkedIn refresh', detail: 'Headline + one win in the about section.' },
    { title: 'Salary research', detail: 'Know your band before conversations start.' },
    { title: 'Side project', detail: 'Ship a visible inch — README counts.' },
  ],
  close: [
    { title: 'Exit checklist', detail: 'Assets, access, laptop, F&F — tick HR items early.' },
    { title: 'Farewells', detail: 'Thank people who shaped you; skip the drama.' },
    { title: 'Rest stockpile', detail: 'Sleep and workouts — you will need both soon.' },
    { title: 'Laptop handback', detail: 'Backup personal files; wipe only what policy says.' },
    { title: 'Final KT session', detail: 'Record or notes for the team inheriting work.' },
    { title: 'Exit interview prep', detail: 'Honest, constructive, not bitter.' },
    { title: 'Benefits review', detail: 'Insurance, PF, leave encashment — know dates.' },
    { title: 'Reference list', detail: 'Three people who’d vouch — ask politely.' },
    { title: 'First week off', detail: 'Block rest before jumping into interviews.' },
  ],
}

export type DailyCopy = {
  dayKey: string
  dayLabel: string
  thought: string
  push: string
  move: string
  focus: FocusItem[]
}

export function formatDayLabel(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function getDailyCopy(stats: NoticeStats): DailyCopy {
  const day = stats.today
  const phase = noticePhase(stats)
  const dayKey = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`

  return {
    dayKey,
    dayLabel: formatDayLabel(day),
    thought: pickOne(thoughts, day, 0),
    push: pickOne(pushes, day, 11),
    move: pickOne(workoutCues, day, 23),
    focus: pickMany(focusPools[phase], day, 3, 37),
  }
}

/** @deprecated use getDailyCopy */
export function dailyNudge(stats: NoticeStats): string {
  return getDailyCopy(stats).thought
}

/** @deprecated use getDailyCopy */
export function dailyWorkoutCue(stats: NoticeStats): string {
  return getDailyCopy(stats).move
}

/** @deprecated use getDailyCopy */
export function phaseFocus(phase: NoticePhase): FocusItem[] {
  return focusPools[phase].slice(0, 3)
}

export function lastWorkingDayLabel(): string {
  const end = parseNoticeDate(noticePeriod.lastWorkingDay)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(end)
}

export type HabitKey = 'move' | 'deep' | 'handover'

export const habitDefs: { key: HabitKey; label: string }[] = [
  { key: 'move', label: 'Moved my body' },
  { key: 'deep', label: 'Deep work block' },
  { key: 'handover', label: 'Handover progress' },
]

export function habitStorageKey(date: Date): string {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  return `prism.notice.habits.${y}-${m}-${d}`
}

export function readHabits(date: Date): Record<HabitKey, boolean> {
  const empty: Record<HabitKey, boolean> = { move: false, deep: false, handover: false }
  try {
    const raw = localStorage.getItem(habitStorageKey(date))
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<Record<HabitKey, boolean>>
    return { ...empty, ...parsed }
  } catch {
    return empty
  }
}

export function writeHabits(date: Date, habits: Record<HabitKey, boolean>) {
  try {
    localStorage.setItem(habitStorageKey(date), JSON.stringify(habits))
  } catch {
    /* ignore */
  }
}
