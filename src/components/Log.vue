<template>
  <div class="log" v-bind="$attrs">
    <div class="log-empty-state" v-if="entries.error">
      {{ entries.error }}
    </div>
    <div class="log-empty-state" v-if="entries.loading">
      {{ t('loading') }}
    </div>
    <div class="log-empty-state" v-if="!entries.error && !entries.loading && entries.entries.length === 0">
      {{ t('no-entries') }}
    </div>
    <template v-for="(entry, index) in listData">
        <router-link
          class="log-entry"
          v-if="entry.type === 'entry'"
          :key="index"
          :to="{ name: 'edit-entry', params: { id: entry.id }}"
          >
          <div class="log-entry-time">
            <span>{{ formatTimestamp(entry.endTimestamp) }}</span>
            <span class="log-entry-time-separator">|</span>
            <span>{{ formatTimestamp(entry.startTimestamp) }}</span>
          </div>
          <div class="log-entry-data">
            <div>
              <span class="log-entry-data-icon"><Icon name="clock"/></span>
              <span>
                {{ formatDuration(entry.startTimestamp, entry.endTimestamp) }}
              </span>
            </div>
            <div>
              <span class="log-entry-data-icon"></span>
              <span>
                <Icon name="arrow-left" v-if="entry.side === LEFT"/>
                {{ (entry.position ? formatPosition(entry.position) : formatSide(entry.side)) }}
                <Icon name="arrow-right" v-if="entry.side === RIGHT"/>
              </span>
            </div>
          </div>
        </router-link>
        <div class="log-interval" v-if="entry.type === 'interval'" :key="index">
          <div class="log-interval-spacer"></div>
          <div class="log-interval-interval">
            {{ entry.interval }}
            <template v-if="entry.sinceLastFeed"> {{ t('since-last-feed') }}</template>
          </div>
          <div class="log-interval-spacer"></div>
        </div>
        <div class="log-day-separator" v-if="entry.type === 'day'" :key="index">
          {{ d(entry.date) }} ({{ t('feed-count', entry.feedCount) }})
        </div>
    </template>
    <router-link :to="{ name: 'add-entry' }">
      <AddButton class="log-addbutton" :title="t('add-new-entry')" />
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useCurrentTime from '../currenttime'
import { formatDuration, formatTimestamp, formatSide, formatPosition } from '../format'
import { Entry, EntryList, Position, Side } from '../log'
import { dateFromTimestamp, truncatedDateTimestamp } from '../timestamp'

import AddButton from './AddButton.vue'
import Icon from './Icon.vue'

type EntryItem = Entry & { type: 'entry' }

interface IntervalItem {
  type: 'interval'
  interval: string
  sinceLastFeed: boolean
}

interface DaySeparatorItem {
  type: 'day'
  date: Date
  feedCount: number
}

type ListItem = EntryItem | IntervalItem | DaySeparatorItem

function getStartOfDay(d: Date): Date {
  const res = new Date(d)

  res.setMilliseconds(0)
  res.setSeconds(0)
  res.setMinutes(0)
  res.setHours(0)

  return res
}

export default defineComponent({
  name: 'Log',
  setup() {
    const { d, t } = useI18n({inheritLocale: true})
    const entries = inject('entries') as Ref<EntryList>

    const tFormatDuration = (start: number, end: number) => formatDuration(t, start, end)
    const tFormatSide = (side: Side) => formatSide(t, side)
    const tFormatPosition = (p: Position) => formatPosition(t, p)
    const currentTime = useCurrentTime()

    return {
      d, t,
      formatDuration: tFormatDuration,
      formatSide: tFormatSide,
      formatPosition: tFormatPosition,
      formatTimestamp,
      entries,
      currentTime,
      LEFT: Side.LEFT,
      RIGHT: Side.RIGHT,
    }
  },
  components: {
    AddButton,
    Icon,
  },
  computed: {
    listData(): ListItem[] {
      const entries = this.entries.entries
      const nEntries = entries.length
      let items: ListItem[] = []
      let lastStartTimestamp = truncatedDateTimestamp(this.currentTime)
      let lastStartOfDay = getStartOfDay(this.currentTime)

      for (let i = 0; i < nEntries; ++i) {
        const entry = entries[i]

        items.push({
          type: 'interval',
          interval: this.formatDuration(entry.endTimestamp, lastStartTimestamp),
          sinceLastFeed: i === 0,
        })

        const startOfDay = getStartOfDay(dateFromTimestamp(entry.startTimestamp))

        if (lastStartOfDay.getTime() !== startOfDay.getTime()) {
          // feedCount will be populated afterwards
          items.push({ type: 'day', date: startOfDay, feedCount: 0 })
        }

        items.push({ type: 'entry', ...entry })

        lastStartTimestamp = entry.startTimestamp
        lastStartOfDay = startOfDay
      }

      let feedCount = 0

      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i]

        if (item.type === 'entry') {
          feedCount++
        } else if (item.type === 'day') {
          item.feedCount = feedCount
          feedCount = 0
        }
      }

      return items
    }
  },
})
</script>

<style>
.log {
  display: flex;
  flex-direction: column;
}

.log-empty-state {
  flex: 1 1 auto;

  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-bg-dark);
}

.log-addbutton {
  position: absolute;
  bottom: 3rem;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
}

.log-entry {
  padding: .5rem;
  display: flex;
  flex-direction: row;
}

.log-entry-time {
  flex: 0 0 2rem;
  display: flex;
  flex-direction: column;
}

.log-entry-time-separator {
  text-align: center;
  font-size: .5rem;
  color: var(--color-bg-dark);
}

.log-entry-data {
  flex: 1 1 auto;
  padding-left: .5rem;
  display: flex;
  flex-direction: column;
}

.log-entry-data > div {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.log-entry-data-icon {
  margin-right: .25rem;
  width: 1rem;
}

.log-interval {
  display: flex;
  flex-direction: row;
}

.log-interval:nth-child(1) {
  margin-top: 1rem;
}

.log-interval-spacer {
  flex: 1 1 auto;
}

.log-interval-interval {
  flex: 0 0 auto;
  font-size: var(--font-size-small);
  color: var(--color-bg-dark);
}

.log-day-separator {
  font-size: var(--font-size-small);
  color: var(--color-bg-dark);
  font-weight: bold;
  padding-left: .5rem;
  margin-top: .5rem;
}
</style>

<i18n>
{
  "en": {
    "loading": "Loading…",
    "no-entries": "No entries yet",
    "since-last-feed": "since last feed",
    "feed-count": "{n} feeding | {n} feedings",
    "add-new-entry": "Add a new entry"
  },
  "fr": {
    "loading": "Chargement…",
    "no-entries": "Aucun enregistrement pour l'instant",
    "since-last-feed": "depuis la dernière tétée",
    "feed-count": "{n} tétée | {n} tétées",
    "add-new-entry": "Ajouter une nouvelle entrée"
  }
}
</i18n>