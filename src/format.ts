import { Composer } from "vue-i18n"
import { Side } from "./log"

type T = Composer["t"]

export function formatTimeNumber(val: number): string {
  return ('' + val).length === 1 ? ('0' + val) : '' + val
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts*1000)
  return `${formatTimeNumber(d.getHours())}:${formatTimeNumber(d.getMinutes())}`
}

export function formatDuration(t: T, startTimestamp: number, endTimestamp: number): string {
  const minutes = Math.floor(Math.abs(endTimestamp - startTimestamp) / 60)

  if (minutes < 60) {
      return `${minutes} ${t('minute', minutes)}`
  }

  const hours = Math.floor(minutes / 60)

  return `${hours} ${t('hour', hours)} ${minutes - 60 * hours} ${t('minute', minutes)}`
}

export function formatSide(t: T, s: Side): string {
  return t(s.toLowerCase())
}