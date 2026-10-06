export function asset(path) {
  if (!path) return '/placeholder.svg'
  return path.startsWith('http') ? path : `/${path.replace(/^\//, '')}`
}

export function limit(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDate(value) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-')
}

export function isRecent(value) {
  return Date.now() - new Date(value).getTime() < 86400000
}

export function timeAgo(value) {
  const diffMins = Math.floor((Date.now() - new Date(value).getTime()) / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  const hours = Math.floor(diffMins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${Math.floor(hours / 24)} day(s) ago`
}

export function ordinalSuffix(n) {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return n + (['th', 'st', 'nd', 'rd'][n % 10] || 'th')
}

export function orderNumber(order) {
  const userOrders = order.user?.orders
  if (!userOrders || !userOrders.length) return null
  const sorted = [...userOrders].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const idx = sorted.findIndex((o) => o.id === order.id)
  return idx >= 0 ? ordinalSuffix(idx + 1) : null
}
