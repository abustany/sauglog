<template>
  <div class="addentry">
    <h2>{{ t('time') }}</h2>
    <div class="addentry-row">
      <div>{{ t('start') }}:</div>
      <div class="addentry-row-grow addentry-row-right">
        <template v-if="startDayOffset">{{ t('days-ago', -startDayOffset) }}, </template>
        <HourInput v-model="start" :name="t('start')" />
      </div>
    </div>
    <div class="addentry-row">
      <div>{{ t('end') }}:</div>
      <div class="addentry-row-grow addentry-row-right">
        <template v-if="endDayOffset">{{ t('days-ago', -endDayOffset) }}, </template>
        <HourInput v-model="end" :name="t('end')" />
      </div>
    </div>
    <h2>{{ t('side') }}</h2>
    <div class="addentry-row">
      <label class="addentry-row-half addentry-row-right"><Icon name="arrow-left"/>{{ t('side-left') }} <input type="radio" name="side" value="LEFT" v-model="side" /></label>
      <label class="addentry-row-half"><input type="radio" name="side" value="RIGHT" v-model="side" /> {{ t('side-right') }}<Icon name="arrow-right"/></label>
    </div>
    <h2>{{ t('position') }}</h2>
    <label class="addentry-label-vertical"><input type="radio" name="position" value="CRADLE" v-model="position" /> {{ t('position-cradle') }}</label>
    <label class="addentry-label-vertical"><input type="radio" name="position" value="CLUTCH" v-model="position" /> {{ t('position-clutch') }}</label>
    <label class="addentry-label-vertical"><input type="radio" name="position" value="LYING" v-model="position" /> {{ t('position-lying') }}</label>
    <div class="addentry-row addentry-row-actions">
      <div class="addentry-row-half">
        <button @click="cancel">{{ t('cancel') }}</button>
      </div>
      <div class="addentry-row-half addentry-row-right">
        <button @click="save">{{ t('save') }}</button>
      </div>
    </div>
    <div class="addentry-row" v-if="id">
      <div>
        <button @click="onDelete" class="addentry-delete">{{ this.confirmDelete ? t('really-delete') : t('delete') }}</button>
      </div>
      <div class="addentry-row-half"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, Ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { AddEntry, Entry, EntryList, Key, Position, SavedEntry, Side, UpdateEntry, DeleteEntry } from '../log'
import HourInput from './HourInput.vue'
import Icon from './Icon.vue'
import { dateFromTimestamp, minuteAlignedDateTime } from '../timestamp'
import useCurrentTime from '../currenttime'

interface Data {
  loading: Boolean,
  start: Date
  end: Date
  side: Side | undefined
  position: Position | undefined
  confirmDelete: boolean
}

const MS_IN_A_DAY = 86400 * 1000

function dayOffset(d1: Date, d2: Date): number {
  return Math.floor(d1.getTime() / MS_IN_A_DAY) - Math.floor(d2.getTime() / MS_IN_A_DAY)
}

export default defineComponent({
  name: 'EditEntry',
  components: {
    HourInput,
    Icon,
  },
  props: {
    id: Number as PropType<Key> // optional
  },
  setup(props) {
    const { t } = useI18n({inheritLocale: true})
    const addEntry = inject('addEntry') as AddEntry
    const updateEntry = inject('updateEntry') as UpdateEntry
    const deleteEntry = inject('deleteEntry') as DeleteEntry
    let baseEntry: SavedEntry | undefined = undefined

    if (props.id) {
      const entries = inject('entries') as Ref<EntryList>
      baseEntry = entries.value.entries.find(e => e.id === props.id)
    }

    const currentTime = useCurrentTime()

    return { t, addEntry, updateEntry, deleteEntry, baseEntry, currentTime }
  },
  data() {
    // for some reason, Typescript thinks that this.baseEntry is a method
    const baseEntry = this.baseEntry as unknown as (SavedEntry | undefined)

    return {
      start: baseEntry ? dateFromTimestamp(baseEntry.startTimestamp) : new Date(),
      end: baseEntry ? dateFromTimestamp(baseEntry.endTimestamp) : new Date(),
      side: baseEntry?.side,
      position: baseEntry?.position,
      confirmDelete: false,
    } as Data
  },
  computed: {
    reframedEnd(): Date {
      const currentTime = minuteAlignedDateTime(this.currentTime)
      let endTime = minuteAlignedDateTime(this.end)

      // assume that an end time further than one hour in the future means the
      // same time one day before
      while (endTime > (currentTime + 3600*1000)) {
        endTime -= MS_IN_A_DAY
      }

      return new Date(endTime)
    },
    endDayOffset(): number {
      return dayOffset(this.reframedEnd, this.currentTime)
    },
    reframedStart(): Date {
      let reframedEndTime = this.reframedEnd.getTime() // already minute aligned
      let startTime = minuteAlignedDateTime(this.start)

      while (reframedEndTime < startTime) {
        startTime -= MS_IN_A_DAY
      }

      return new Date(startTime)
    },
    startDayOffset(): number {
      return dayOffset(this.reframedStart, this.currentTime)
    },
  },
  methods: {
    async save() {
      if (!this.side || !this.start || !this.end) return

      const entry: Entry = {
        startTimestamp: this.reframedStart.getTime() / 1000,
        endTimestamp: this.reframedEnd.getTime() / 1000,
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
    },
    async onDelete() {
      if (!this.confirmDelete) {
        this.confirmDelete = true
        return
      }

      await this.deleteEntry(this.id!)

      this.$router.replace({ path: '/' })
    },
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

.addentry-row > div {
  flex: 0 0 auto;
}

.addentry-row-grow {
  flex: 1 1 auto !important;
}

.addentry-row-right {
  text-align: right;
}

.addentry-row-half {
  flex: 1 1 50% !important;
}

.addentry-row-actions {
  margin-top: 2rem;
}

.addentry-label-vertical + .addentry-label-vertical {
  margin-top: .5rem;
}

button.addentry-delete {
  color: #a00;
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
    "save": "Save",
    "days-ago": "Yesterday | {n} days ago",
    "delete": "Delete",
    "really-delete": "Really delete?"
  },
  "fr": {
    "time": "Heure",
    "start": "Début",
    "end": "Fin",
    "side": "Côté",
    "position": "Position",
    "cancel": "Annuler",
    "save": "Enregistrer",
    "days-ago": "Hier | il y a {n} jours",
    "delete": "Supprimer",
    "really-delete": "Supprimer vraiment ?"
  }
}
</i18n>
