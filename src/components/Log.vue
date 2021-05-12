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
      <div class="log-entry" v-if="entry.type === 'entry'" :key="index">
        <div class="log-entry-time">
          {{ formatTimestamp(entry.startTimestamp) }}
        </div>
        <div class="log-entry-duration">
          {{ formatDuration(entry.startTimestamp, entry.endTimestamp) }}
        </div>
        <div class="log-entry-side">
          {{ formatSide(entry.side) }}
        </div>
      </div>

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

import { formatDuration, formatTimestamp, formatSide } from '../format'
import { Entry, EntryList, Side } from '../log'

import AddButton from './AddButton.vue'

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

    return {
      t,
      formatDuration: tFormatDuration,
      formatSide: tFormatSide,
      formatTimestamp,
      entries,
    }
  },
  components: {
    AddButton
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
}

.log-entry-duration {
  flex: 1 1 auto;
  padding-left: .5rem;
}

.log-entry-side {
  flex: 0 0 auto;
  text-align: right;
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