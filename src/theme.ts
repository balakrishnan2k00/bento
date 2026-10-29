/** Local-time hours when the light theme is active (6:00 inclusive → 18:00 exclusive). */
export const dayThemeHours = { from: 6, until: 18 } as const

export type ThemeMode = 'light' | 'dark'
export type ThemePreference = 'auto' | ThemeMode

const STORAGE_KEY = 'prism.theme'

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'auto' || stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }
  return 'auto'
}

export function writeThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    /* ignore */
  }
}

export function themeForTime(date: Date): ThemeMode {
  const hour = date.getHours()
  const { from, until } = dayThemeHours
  return hour >= from && hour < until ? 'light' : 'dark'
}

export function resolveTheme(preference: ThemePreference, now: Date): ThemeMode {
  return preference === 'auto' ? themeForTime(now) : preference
}

export function applyDocumentTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
  const base = import.meta.env.BASE_URL
  const icon = document.querySelector<HTMLLinkElement>('link[data-theme-icon]')
  if (icon) {
    icon.href = `${base}${theme === 'dark' ? 'favicon-dark.svg' : 'favicon.svg'}`
  }
}
