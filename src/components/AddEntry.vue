<template>
  <div class="addentry">
    <div class="addentry-row">
      <div class="addentry-row-left">Start:</div>
      <div class="addentry-row-right"><HourInput v-model="start" /></div>
    </div>
    <div class="addentry-row">
      <div class="addentry-row-left">End:</div>
      <div class="addentry-row-right"><HourInput v-model="end" /></div>
    </div>
    <div class="addentry-row">
      <div class="addentry-row-center">
        <label>Left <input type="radio" name="side" value="LEFT" v-model="side" /></label>
        <label><input type="radio" name="side" value="RIGHT" v-model="side" /> Right</label>
      </div>
    </div>
    <div class="addentry-row">
      <div class="addentry-row-left">
        <input type="button" value="Cancel" @click="cancel"/>
      </div>
      <div class="addentry-row-right">
        <input type="button" value="Save" @click="save"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

import { AddEntry, Side } from '../log'
import HourInput from './HourInput.vue'

function truncatedDateTimestamp(d: Date) {
  return Math.floor(d.getTime() / 1000 / 60) * 60
}

interface Data {
  start: Date
  end: Date
  side: Side | undefined
}

export default defineComponent({
  name: 'AddEntry',
  components: {
    HourInput
  },
  setup() {
    const addEntry = inject('addEntry') as AddEntry

    return { addEntry }
  },
  data() {
    return {
      start: new Date(),
      end: new Date(),
      side: undefined,
    } as Data
  },
  methods: {
    async save() {
      if (!this.side || !this.start || !this.end) return

      let startTimestamp = truncatedDateTimestamp(this.start)
      const endTimestamp = truncatedDateTimestamp(this.end)

      if (endTimestamp < startTimestamp) {
        // if the end hour is before the start hour, it's because it was a day earlier
        startTimestamp -= 86400 // seconds, a day
      }

      await this.addEntry({
        startTimestamp,
        endTimestamp,
        side: this.side,
      })

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
</style>
