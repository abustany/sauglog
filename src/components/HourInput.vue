<template>
  <div class="hourinput-modal" v-if="picking">
    <div class="hourinput-modal-title">
      <h1>{{ t(picking) }}</h1>
      <input type="button" value="×" @click="closePicker" />
    </div>
    <div class="hourinput-modal-content">
      <template v-for="n in pickRange" :key="n">
        <input
          type="button"
          class="hourinput-modal-value"
          :class="{ 'hourinput-modal-value-active': (n - 1) === pickedValue }"
          :value="formatTimeNumber(n - 1)"
          @click="pick(n - 1)"
          />
      </template>
    </div>
  </div>
  <span class="hourinput-value" @click="openPicker">
    {{ formatTimeNumber(hours) }} : {{ formatTimeNumber(minutes) }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatTimeNumber } from '../format'

type PickState = null | 'Hours' | 'Minutes'

interface Data {
  picking: PickState
}

export default defineComponent({
  name: 'HourInput',
  setup() {
    const { t } = useI18n({inheritLocale: true})

    return { t }
  },
  props: {
    modelValue: {type: Date, required: true}
  },
  emits: ['update:modelValue'],
  data() {
    return {
      picking: null,
    } as Data
  },
  computed: {
    hours: {
      get(): number {
        return this.modelValue.getHours()
      },
      set(value: number) {
        const updated = new Date(this.modelValue)
        updated.setHours(value)
        this.$emit('update:modelValue', updated)
      }
    },
    minutes: {
      get(): number {
        return this.modelValue.getMinutes()
      },
      set(value: number) {
        const updated = new Date(this.modelValue)
        updated.setMinutes(value)
        this.$emit('update:modelValue', updated)
      }
    },
    pickRange(): number {
      if (this.picking === 'Hours') return 24
      if (this.picking === 'Minutes') return 60
      return 0
    },
    pickedValue(): number {
      if (this.picking === 'Hours') return this.hours
      if (this.picking === 'Minutes') return this.minutes
      return 0
    },
  },
  methods: {
    openPicker(): void {
      this.picking = 'Hours'
    },
    closePicker(): void {
      this.picking = null;
    },
    pick(val: number): void {
      if (this.picking === 'Hours') {
        this.hours = val
        this.picking = 'Minutes';
      } else if (this.picking === 'Minutes') {
        this.minutes = val
        this.picking = null;
      }
    },
    formatTimeNumber,
  }
})
</script>

<style>
.hourinput-value {
  cursor: pointer;
  border-bottom: 1px solid var(--color-bg-dark);
}

.hourinput-modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--color-bg);
  padding: 1rem;

  display: flex;
  flex-direction: column;
}

.hourinput-modal-title {
  flex: 0 0 auto;
  margin-bottom: 1rem;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.hourinput-modal-title > h1 {
  flex: 1 1 auto;
  text-align: left;
  margin: 0;
  font-size: var(--font-size-title);
}

.hourinput-modal-title > input {
  flex: 0 0 auto;

  font-size: 32pt;
}

.hourinput-modal-content {
  flex: 0 0 auto;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.hourinput-modal-value {
  flex: 0 0 2em;
  text-align: center;
  font-size: 32pt;
  margin-bottom: .5rem;
  margin-right: .5rem;
}

.hourinput-modal-value-active {
  background-color: var(--color-accent) !important
}
</style>

<i18n>
{
  "en": {
    "Hours": "Hours",
    "Minutes": "Minutes"
  },
  "fr": {
    "Hours": "Heure",
    "Minutes": "Minute"
  }
}
</i18n>