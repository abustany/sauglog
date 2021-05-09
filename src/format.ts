import { Side } from "./log"

export function formatTimeNumber(val: number): string {
  return ('' + val).length === 1 ? ('0' + val) : '' + val
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts*1000)
  return `${formatTimeNumber(d.getHours())}:${formatTimeNumber(d.getMinutes())}`
}

function plural(s: string, n: number): string {
    return (n < 2) ? s : (s + 's')
}

export function formatDuration(startTimestamp: number, endTimestamp: number): string {
  const minutes = Math.floor(Math.abs(endTimestamp - startTimestamp) / 60)

  if (minutes < 60) {
      return `${minutes} ${plural('minute', minutes)}`
  }

  const hours = Math.floor(minutes / 60)

  return `${hours} ${plural('hour', hours)} ${minutes - 60 * hours} ${plural('minute', minutes)}`
}

export function formatSide(s: Side): string {
  return s.toLowerCase()
}