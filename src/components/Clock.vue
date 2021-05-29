<template>
  <div ref="el" class="clock">
    <div
      v-for="n in valueRange"
      :key="'background-' + n"
      class="clock-value-background"
      :class="{ 'clock-value-active': (n - 1) === modelValue }"
      :style="position(size, n - 1, valueRange, nRows, skip)"
    ></div>
    <button
      v-for="n in valueRange"
      :key="'button-' + n"

      class="clock-value-button"
      :style="position(size, n - 1, valueRange, nRows, skip)"
      @mousedown="startPick"
      @touchstart="startPick"
      @mousemove="pick"
      @touchmove="pick"
      >{{ n - 1}}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, Ref, ref } from 'vue'

type Mode = 'hours' | 'minutes'

function position(radiusPx: number, n: number, range: number, rows: number = 1, skip: number = 0) {
  const angle = -Math.PI / 2 + 2 * Math.PI * n / range * rows
  const row = Math.floor(n / range * rows)
  const xFactor = (1 + Math.cos(angle)) / 2
  const yFactor = (1 + Math.sin(angle)) / 2
  const valueSize = '2rem' // a value button is valueSize x valueSize large
  const rowInterval = '2.5rem' // space between rows

  const coord = (factor: number) => `calc(calc(${radiusPx}px - ${valueSize} - ${2 * row} * ${rowInterval}) * ${factor} + ${row} * ${rowInterval})`

  let style: Partial<CSSStyleDeclaration> = {
    position: 'absolute',
    left: coord(xFactor),
    top: coord(yFactor),
  }

  if (skip && (n % skip)) {
    style.color = 'transparent'
  }

  return style
}

export default defineComponent({
  name: 'Clock',
  props: {
    mode: {type: String as PropType<Mode>, required: true},
    modelValue: {type: Number, required: true},
  },
  emits: ['update:modelValue', 'picked'],
  setup(_props, context) {
    const el: Ref<HTMLElement | null> = ref(null)
    const size = ref(0)
    const picking = ref(false)

    const mouseUpListener = () => {
      if (!picking.value) { return }
      picking.value = false
      context.emit('picked')
    }

    const mouseUpEvents = ['mouseup', 'touchend']

    onMounted(() => {
      if (!el.value) { return }

      const rect = el.value.getBoundingClientRect()
      size.value = Math.min(rect.height, rect.width)

      for (const event of mouseUpEvents) window.addEventListener(event, mouseUpListener)
    })

    onUnmounted(() => {
      for (const event of mouseUpEvents) window.removeEventListener(event, mouseUpListener)
    })

    return { el, size, position, picking }
  },
  computed: {
    valueRange(): number {
      switch(this.mode) {
        case 'hours': return 24
        case 'minutes': return 60
      }
    },
    nRows(): number {
      switch(this.mode) {
        case 'hours': return 2
        case 'minutes': return 1
      }
    },
    skip(): number {
      switch(this.mode) {
        case 'hours': return 0
        case 'minutes': return 5
      }
    },
  },
  methods: {
    startPick(ev: MouseEvent) {
      ev.preventDefault()
      this.picking = true
      this.setValueFromEvent(ev)
    },
    pick(ev: MouseEvent) {
      if (!this.picking) { return }
      ev.preventDefault()
      this.setValueFromEvent(ev)
    },
    setValueFromEvent(ev: MouseEvent | TouchEvent) {
      const parent = (ev.target as HTMLElement | null)?.parentElement
      if (!parent) { return }

      const rect = parent.getBoundingClientRect()
      const normalizeCoord = (coord: number) => 2 * coord / this.size - 1

      let eventX: number, eventY: number

      if (ev.type.startsWith('mouse')) {
        let mouseEvent = ev as MouseEvent
        eventX = mouseEvent.pageX
        eventY = mouseEvent.pageY
      } else {
        let touchEvent = ev as TouchEvent
        const touch = touchEvent.touches[0]
        eventX = touch.pageX
        eventY = touch.pageY
      }

      const x = normalizeCoord(Math.max(0, eventX - rect.x))
      const y = normalizeCoord(Math.max(0, eventY - rect.y))
      let angle = 0

      if (x === 0) {
        angle = y < 0 ? 0 : Math.PI
      } else {
        angle = Math.atan(y/x) + Math.PI / 2
        if (x < 0) angle += Math.PI
      }

      const radius = Math.sqrt(x * x + y * y) * this.size / 2
      let row = 1

      while (this.size / 2 - 1.5 * 32 * row > radius && row < this.nRows) {
        row++
      }

      let value = Math.round(angle/Math.PI/2*this.valueRange/this.nRows + (row - 1) * (this.valueRange / this.nRows))

      if (value >= this.valueRange) {
        value -= this.valueRange / this.nRows
      }

      this.$emit('update:modelValue', value)
    },
  },
})
</script>

<style>
.clock {
  position: relative;
}

.clock-value-button {
  padding: .25rem;
  height: 2rem;
  width: 2rem;
  border: 0 !important;
}

.clock-value-background {
  padding: .25rem;
  height: 32px;
  width: 32px;
  border-radius: 100% 100%;
}

.clock-value-active {
  background-color: var(--color-accent);
  border: 1px solid var(--color-bg-dark);
}
</style>