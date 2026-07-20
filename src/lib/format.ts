export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const d = Math.floor(hr / 24)
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function formatDate(iso: string): string {
  return new Date(iso + (iso.length === 10 ? 'T00:00:00' : '')).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function daysUntil(isoDate: string): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(isoDate + 'T00:00:00')
  return Math.round((target.getTime() - now.getTime()) / 86400000)
}

export function greeting(name: string): string {
  const h = new Date().getHours()
  const part = h < 5 ? 'Burning the midnight oil' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return `${part}, ${name.split(' ')[0]}`
}

export function levelFromXp(xp: number): { level: number; intoLevel: number; span: number; total: number } {
  let level = 1
  let need = 100
  let remaining = xp
  while (remaining >= need) {
    remaining -= need
    level += 1
    need = 100 + (level - 1) * 50
  }
  return { level, intoLevel: remaining, span: need, total: xp }
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? '' : 's'}`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

export const AVATAR_COLORS = ['#6366F1', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#3B82F6']

export function pickColor(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]!
}
