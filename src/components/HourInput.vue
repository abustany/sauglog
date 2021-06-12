<template>
  <div class="hourinput-modal" v-if="picking">
    <div class="hourinput-modal-title">
      <button name="Close" @click="closePicker">×</button>
    </div>
    <div class="hourinput-modal-value">
      {{ formatTimeNumber(currentHours) }} : {{ formatTimeNumber(currentMinutes) }}
    </div>
    <Clock
      class="hourinput-modal-content"
      :mode="picking"
      v-model="currentClockValue"
      @picked="picked"
      />
  </div>
  <button :name="name" class="hourinput-value" @click="openPicker">
    {{ formatTimeNumber(hours) }} : {{ formatTimeNumber(minutes) }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatTimeNumber } from '../format'
import Clock from './Clock.vue'

type PickState = null | 'hours' | 'minutes'

export default defineComponent({
  name: 'HourInput',
  setup() {
    const { t } = useI18n({inheritLocale: true})

    return { t }
  },
  props: {
    name: {type: String},
    modelValue: {type: Date, required: true}
  },
  components: { Clock },
  emits: ['update:modelValue'],
  data() {
    return {
      picking: null as PickState,
      currentClockValue: 0,
    }
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
    currentHours(): number {
      return this.picking === 'hours' ? this.currentClockValue : this.hours
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
    currentMinutes(): number {
      return this.picking === 'minutes' ? this.currentClockValue : this.minutes
    },
  },
  methods: {
    openPicker(): void {
      this.currentClockValue = this.hours
      this.picking = 'hours'
    },
    closePicker(): void {
      this.picking = null;
    },
    picked(): void {
      if (this.picking === 'hours') {
        this.hours = this.currentClockValue
        this.currentClockValue = this.minutes
        this.picking = 'minutes';
      } else if (this.picking === 'minutes') {
        this.minutes = this.currentClockValue
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
  align-items: center;

  z-index: 1000;
}

.hourinput-modal-title {
  flex: 0 0 auto;
  margin-bottom: 1rem;
  text-align: right;
  width: 100%;
}

.hourinput-modal-title > button {
  font-size: 32pt;
}

.hourinput-modal-value {
  flex: 0 0 auto;
  font-size: var(--font-size-title);
  margin-bottom: 1rem;
}

.hourinput-modal-content {
  flex: 1 0 15rem;
  width: 15rem;
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
