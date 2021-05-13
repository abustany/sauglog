<template>
    <svg class="icon"><use :xlink:href="iconsUrl + '#icon-' + name"></use></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import iconsUrl from '../assets/icons.svg'

export default defineComponent({
  name: 'Icon',
  setup() {
    return { iconsUrl }
  },
  props: {
      name: {type: String, required: true},
  }
})
</script>

<style>
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  position: relative;
  top: .12rem;
}
</style>