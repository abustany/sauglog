<template>
  <div class="log" v-bind="$attrs">
    <div class="log-empty-state" v-if="entries.error">
      {{ entries.error }}
    </div>
    <div class="log-empty-state" v-if="entries.loading">
      {{ t('loading') }}
    </div>
    <div class="log-empty-state" v-if="!entries.loading && entries.entries.length === 0">
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
              <span class="log-entry-data-icon"><Icon name="info"/></span>
              <span>
                {{ formatSide(entry.side) + (entry.position ? `, ${formatPosition(entry.position)}` : '') }}
              </span>
            </div>
          </div>
        </router-link>
        <div class="log-interval" v-if="entry.type === 'interval'" :key="index">
          <div class="log-interval-spacer"></div>
          <div class="log-interval-interval">{{ entry.interval }}</div>
          <div class="log-interval-spacer"></div>
        </div>
    </template>
  </div>
  <router-link :to="{ name: 'add-entry' }">
    <AddButton class="log-addbutton" />
  </router-link>
</template>

<script lang="ts">
import { defineComponent, inject, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatDuration, formatTimestamp, formatSide, formatPosition } from '../format'
import { Entry, EntryList, Position, Side } from '../log'

import AddButton from './AddButton.vue'
import Icon from './Icon.vue'

type EntryItem = Entry & { type: 'entry' }

interface IntervalItem {
  type: 'interval'
  interval: string
}

type ListItem = EntryItem | IntervalItem

export default defineComponent({
  name: 'Log',
  setup() {
    const { t } = useI18n({inheritLocale: true})
    const entries = inject('entries') as Ref<EntryList>

    const tFormatDuration = (start: number, end: number) => formatDuration(t, start, end)
    const tFormatSide = (side: Side) => formatSide(t, side)
    const tFormatPosition = (p: Position) => formatPosition(t, p)

    return {
      t,
      formatDuration: tFormatDuration,
      formatSide: tFormatSide,
      formatPosition: tFormatPosition,
      formatTimestamp,
      entries,
    }
  },
  components: {
    AddButton,
    Icon,
  },
  computed: {
    listData(): ListItem[] {
      const entries = this.entries.entries;
      const nEntries = entries.length;
      let items: ListItem[] = [];

      for (let i = 0; i < nEntries; ++i) {
        const entry = entries[i]

        items.push({ type: 'entry', ...entry })

        if (i < (nEntries - 1)) {
          const next = entries[i + 1]
          items.push({ type: 'interval', interval: this.formatDuration(next.endTimestamp, entry.startTimestamp) })
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
}

.log-interval {
  display: flex;
  flex-direction: row;
}

.log-interval-spacer {
  flex: 1 1 auto;
}

.log-interval-interval {
  flex: 0 0 auto;
  font-size: var(--font-size-small);
  color: var(--color-bg-dark);
}
</style>

<i18n>
{
  "en": {
    "loading": "Loading…",
    "no-entries": "No entries yet"
  },
  "fr": {
    "loading": "Chargement…",
    "no-entries": "Aucun enregistrement pour l'instant"
  }
}
</i18n>