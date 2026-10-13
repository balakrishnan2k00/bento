export function greetingFor(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  if (hour < 21) return 'Evening'
  return 'Night'
}

export function formatClock(date: Date) {
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const suffix = date.getHours() >= 12 ? 'PM' : 'AM'
  const hour12 = date.getHours() % 12 || 12
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${suffix}`
}

export function formatPillDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
