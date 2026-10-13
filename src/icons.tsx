import { useState } from 'react'
import type { ReactNode } from 'react'
import type { IconName } from './data'

type LetterMark = {
  bg: string
  fg: string
  text: string
  size?: number
}

const letters: Record<IconName, LetterMark> = {
  gmail: { bg: '#EA4335', fg: '#fff', text: 'M' },
  keep: { bg: '#FBBC04', fg: '#fff', text: 'K' },
  drive: { bg: '#188038', fg: '#fff', text: 'D' },
  amazonPhotos: { bg: '#232F3E', fg: '#FF9900', text: 'a' },
  googlePhotos: { bg: '#1A73E8', fg: '#fff', text: 'P' },
  facebook: { bg: '#1877F2', fg: '#fff', text: 'f', size: 15 },
  yahoo: { bg: '#6001D2', fg: '#fff', text: 'Y' },
  linkedin: { bg: '#0A66C2', fg: '#fff', text: 'in', size: 10 },
  reddit: { bg: '#FF4500', fg: '#fff', text: 'r' },
  x: { bg: '#111111', fg: '#fff', text: 'X', size: 12 },
  youtube: { bg: '#FF0033', fg: '#fff', text: '▶', size: 10 },
  amazon: { bg: '#232F3E', fg: '#FF9900', text: 'a' },
  espn: { bg: '#CC0000', fg: '#fff', text: 'E' },
  prime: { bg: '#00A8E1', fg: '#fff', text: '▶', size: 10 },
  netflix: { bg: '#E50914', fg: '#fff', text: 'N' },
  hulu: { bg: '#1CE783', fg: '#0B1C12', text: 'h' },
  crunchyroll: { bg: '#F47521', fg: '#fff', text: 'C' },
  tiktok: { bg: '#111111', fg: '#fff', text: '♪', size: 13 },
  disney: { bg: '#0E1B4D', fg: '#fff', text: 'D' },
  spotify: { bg: '#1DB954', fg: '#fff', text: '♫', size: 12 },
  analytics: { bg: '#F9AB00', fg: '#fff', text: 'G' },
  notion: { bg: '#111111', fg: '#fff', text: 'N' },
  figma: { bg: '#1E1E1E', fg: '#fff', text: 'F' },
}

function Tile({ bg, children }: { bg: string; children?: ReactNode }) {
  const framed = bg === '#ffffff'
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x={framed ? 0.6 : 0}
        y={framed ? 0.6 : 0}
        width={framed ? 22.8 : 24}
        height={framed ? 22.8 : 24}
        rx="6"
        fill={bg}
        stroke={framed ? '#e4e7ec' : 'none'}
        strokeWidth={framed ? 1 : 0}
      />
      {children}
    </svg>
  )
}

function LetterTile({ bg, fg, text, size = 12 }: LetterMark) {
  return (
    <Tile bg={bg}>
      <text
        x="12"
        y="16.2"
        textAnchor="middle"
        fontSize={size}
        fontWeight="700"
        fill={fg}
        fontFamily="Arial, Helvetica, sans-serif"
      >
        {text}
      </text>
    </Tile>
  )
}

function faviconSrc(href: string) {
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(href)}`
}

export function ServiceIcon({ name, href }: { name: IconName; href: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <span className="service-icon">
      {failed ? (
        <LetterTile {...letters[name]} />
      ) : (
        <img alt="" src={faviconSrc(href)} width={20} height={20} onError={() => setFailed(true)} />
      )}
    </span>
  )
}

export function Flag() {
  const spokes = Array.from({ length: 24 }, (_, index) => {
    const angle = (index * Math.PI) / 12
    return { x2: 30 + Math.cos(angle) * 4.4, y2: 18 + Math.sin(angle) * 4.4 }
  })

  return (
    <svg className="flag" viewBox="0 0 60 36" aria-hidden="true">
      <defs>
        <clipPath id="bento-flag">
          <rect width="60" height="36" rx="4" />
        </clipPath>
      </defs>
      <g clipPath="url(#bento-flag)">
        <rect width="60" height="12" fill="#FF9933" />
        <rect y="12" width="60" height="12" fill="#fff" />
        <rect y="24" width="60" height="12" fill="#138808" />
        <circle cx="30" cy="18" r="4.6" fill="none" stroke="#06038D" strokeWidth="1.1" />
        {spokes.map((spoke, index) => (
          <line
            key={index}
            x1="30"
            y1="18"
            x2={spoke.x2}
            y2={spoke.y2}
            stroke="#06038D"
            strokeWidth="0.7"
          />
        ))}
        <circle cx="30" cy="18" r="1" fill="#06038D" />
      </g>
    </svg>
  )
}

export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 36 36" aria-hidden="true">
      <rect width="36" height="36" rx="10" fill="#101828" />
      <rect x="5" y="5" width="12" height="12" rx="3.2" fill="#FF9933" />
      <rect x="19" y="5" width="12" height="12" rx="3.2" fill="#F8FAFC" />
      <rect x="5" y="19" width="12" height="12" rx="3.2" fill="#138808" />
      <rect x="19" y="19" width="12" height="12" rx="3.2" fill="#2563EB" />
    </svg>
  )
}

export function Chevron() {
  return (
    <svg className="chevron" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 3.5 10.5 8 6 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg className="search-icon" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.4 12.4 17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function ClockIcon() {
  return (
    <svg className="mini-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="5.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5.2V8l2 1.4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function CalendarMiniIcon() {
  return (
    <svg className="mini-icon" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.5" y="3.2" width="11" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 6.4h11M5.4 2.2v2.2M10.6 2.2v2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function WeatherIcon({ code }: { code: number }) {
  const rainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95
  const snowy = code >= 71 && code <= 77
  const cloudy = code >= 2

  if (rainy || snowy) {
    return (
      <svg className="mini-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5 7.2a2.6 2.6 0 0 1 5-.4 2 2 0 1 1 .6 3.9H5.4a2.2 2.2 0 0 1-.4-4.3z" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 12.2 5.4 14M8.4 12v1.8M10.6 12.2 11.2 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    )
  }

  if (cloudy) {
    return (
      <svg className="mini-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M5.2 11.2h6.1a2.3 2.3 0 0 0 .3-4.6 3 3 0 0 0-5.7-.5 2.1 2.1 0 0 0-.7 4.1z" fill="none" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    )
  }

  return (
    <svg className="mini-icon sun" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="2.4" fill="#F5B942" />
      <path
        d="M8 1.8v1.6M8 12.6v1.6M1.8 8h1.6M12.6 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"
        stroke="#E3A227"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SparkleIcon() {
  return (
    <svg className="sparkle" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 1.5 9.1 6 13.5 8 9.1 10 8 14.5 6.9 10 2.5 8 6.9 6 8 1.5z" fill="#E7B15A" />
    </svg>
  )
}

export function ArrowIcon() {
  return (
    <svg className="go-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M6.2 4H12v5.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
