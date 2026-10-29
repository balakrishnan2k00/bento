import type { ThemePreference } from './theme'

const options: { value: ThemePreference; label: string; title: string }[] = [
  { value: 'auto', label: 'Auto', title: 'Follow schedule (light 6am–6pm)' },
  { value: 'light', label: 'Light', title: 'Light mode' },
  { value: 'dark', label: 'Dark', title: 'Dark mode' },
]

export function ThemeToggle({
  value,
  onChange,
}: {
  value: ThemePreference
  onChange: (next: ThemePreference) => void
}) {
  return (
    <div className="engines theme-engines" role="radiogroup" aria-label="Theme">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="engine theme-engine"
          role="radio"
          aria-checked={value === option.value}
          title={option.title}
          onClick={() => onChange(option.value)}
        >
          {option.value === 'light' ? (
            <>
              <SunIcon />
              <span className="sr-only">{option.label}</span>
            </>
          ) : option.value === 'dark' ? (
            <>
              <MoonIcon />
              <span className="sr-only">{option.label}</span>
            </>
          ) : (
            option.label
          )}
        </button>
      ))}
    </div>
  )
}

function SunIcon() {
  return (
    <svg className="theme-icon" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      <path
        d="M8 1.2v2M8 12.8v2M1.2 8h2M12.8 8h2M3.1 3.1l1.4 1.4M11.5 11.5l1.4 1.4M3.1 12.9l1.4-1.4M11.5 4.5l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="theme-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.2 2.2a5.8 5.8 0 1 0 7.6 7.6A5.5 5.5 0 0 1 6.2 2.2Z" fill="currentColor" />
    </svg>
  )
}
