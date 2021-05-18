export function truncatedDateTimestamp(d: Date) {
  return Math.floor(d.getTime() / 1000 / 60) * 60
}

export function dateFromTimestamp(t: number): Date {
  return new Date(t*1000)
}
