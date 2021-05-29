<template>
  <div class="addentry">
    <h2>{{ t('time') }}</h2>
    <div class="addentry-row">
      <div class="addentry-row-left">{{ t('start') }}:</div>
      <div class="addentry-row-right"><HourInput v-model="start" :name="t('start')" /></div>
    </div>
    <div class="addentry-row">
      <div class="addentry-row-left">{{ t('end') }}:</div>
      <div class="addentry-row-right"><HourInput v-model="end" :name="t('end')" /></div>
    </div>
    <h2>{{ t('side') }}</h2>
    <div class="addentry-row">
      <div class="addentry-row-center">
        <label>{{ t('side-left') }} <input type="radio" name="side" value="LEFT" v-model="side" /></label>
        <label><input type="radio" name="side" value="RIGHT" v-model="side" /> {{ t('side-right') }}</label>
      </div>
    </div>
    <h2>{{ t('position') }}</h2>
    <label class="addentry-label-vertical"><input type="radio" name="position" value="CRADLE" v-model="position" /> {{ t('position-cradle') }}</label>
    <label class="addentry-label-vertical"><input type="radio" name="position" value="CLUTCH" v-model="position" /> {{ t('position-clutch') }}</label>
    <label class="addentry-label-vertical"><input type="radio" name="position" value="LYING" v-model="position" /> {{ t('position-lying') }}</label>
    <div class="addentry-row addentry-row-actions">
      <div class="addentry-row-left">
        <button @click="cancel">{{ t('cancel') }}</button>
      </div>
      <div class="addentry-row-right">
        <button @click="save">{{ t('save') }}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { AddEntry, Entry, EntryList, Key, Position, SavedEntry, Side, UpdateEntry } from '../log'
import HourInput from './HourInput.vue'
import { dateFromTimestamp, truncatedDateTimestamp } from '../timestamp'

interface Data {
  loading: Boolean,
  start: Date
  end: Date
  side: Side | undefined
  position: Position | undefined
}

export default defineComponent({
  name: 'EditEntry',
  components: {
    HourInput
  },
  props: {
    id: Number as PropType<Key> // optional
  },
  setup(props) {
    const { t } = useI18n({inheritLocale: true})
    const addEntry = inject('addEntry') as AddEntry
    const updateEntry = inject('updateEntry') as UpdateEntry
    let baseEntry: SavedEntry | undefined = undefined

    if (props.id) {
      const entries = inject('entries') as Ref<EntryList>
      baseEntry = entries.value.entries.find(e => e.id === props.id)
    }

    return { t, addEntry, updateEntry, baseEntry }
  },
  data() {
    // for some reason, Typescript thinks that this.baseEntry is a method
    const baseEntry = this.baseEntry as unknown as (SavedEntry | undefined)

    return {
      start: baseEntry ? dateFromTimestamp(baseEntry.startTimestamp) : new Date(),
      end: baseEntry ? dateFromTimestamp(baseEntry.endTimestamp) : new Date(),
      side: baseEntry?.side,
      position: baseEntry?.position,
    } as Data
  },
  methods: {
    async save() {
      if (!this.side || !this.start || !this.end) return

      let startTimestamp = truncatedDateTimestamp(this.start)
      let endTimestamp = truncatedDateTimestamp(this.end)
      const nowTimestamp = truncatedDateTimestamp(new Date())

      const SECONDS_IN_A_DAY = 86400

      if (endTimestamp > nowTimestamp) {
        endTimestamp -= SECONDS_IN_A_DAY
      }

      while (startTimestamp > endTimestamp) {
        startTimestamp -= SECONDS_IN_A_DAY
      }

      const entry: Entry = {
        startTimestamp,
        endTimestamp,
        side: this.side,
        position: this.position,
      }

      if (this.id) {
        await this.updateEntry(this.id, entry)
      } else {
        await this.addEntry(entry)
      }

      this.$router.replace({ path: '/' })
    },
    cancel() {
      this.$router.replace({ path: '/' })
    }
  }
})
</script>

<style>
.addentry {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.addentry h2 {
  font-size: var(--font-size-base);
  text-transform: uppercase;
  margin: 1rem 0 .5rem 0;
}

.addentry h2:nth-child(1) {
  margin-top: 0;
}

.addentry label {
  text-transform: capitalize;
}

.addentry-row {
  flex: 0 0 auto;

  display: flex;
  flex-direction: row;

  margin-bottom: .5rem;
}

.addentry-row-left {
  flex: 0 0 auto;
}

.addentry-row-right {
  flex: 1 1 auto;
  text-align: right;
}

.addentry-row-center {
  flex: 1 1 auto;
  text-align: center;
}

.addentry-row-actions {
  margin-top: 2rem;
}

.addentry-label-vertical + .addentry-label-vertical {
  margin-top: .5rem;
}
</style>

<i18n>
{
  "en": {
    "time": "Time",
    "start": "Start",
    "end": "End",
    "side": "Side",
    "position": "Position",
    "cancel": "Cancel",
    "save": "Save"
  },
  "fr": {
    "time": "Heure",
    "start": "Début",
    "end": "Fin",
    "side": "Côté",
    "position": "Position",
    "cancel": "Annuler",
    "save": "Enregistrer"
  }
}
</i18n>