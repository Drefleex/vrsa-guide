export const AVATAR_COLORS = [
  '#003B6F','#1A5FA8','#1A6B3A','#7C3AED',
  '#D97706','#0E7490','#9A3412','#5B21B6',
]

export function getInitials(name) {
  const w = name.trim().split(/\s+/)
  return w.length >= 2
    ? (w[0][0] + w[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

export function getAvatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}