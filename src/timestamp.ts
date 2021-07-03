export function minuteAlignedDateTime(d: Date): number {
  const MINUTE_MS = 60 * 1000;
  return Math.floor(d.getTime() / MINUTE_MS) * MINUTE_MS
}

export function dateFromTimestamp(t: number): Date {
  return new Date(t*1000)
}
