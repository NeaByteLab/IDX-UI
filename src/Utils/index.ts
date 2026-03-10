export function dateToYYYYMMDD(dateStr: string): string {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) {
    return ''
  }
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

export function pageToOffset(page: number, pageSize: number): number {
  return Math.max(0, (page - 1) * pageSize)
}

export function totalPages(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) {
    return 0
  }
  return Math.ceil(total / pageSize)
}
