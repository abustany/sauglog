<template>
    <svg class="icon" :aria-label="name"><use :xlink:href="iconsUrl + '#icon-' + name"></use></svg>
</template>

<script setup lang="ts">
import iconsUrl from '../assets/icons.svg'

const props = defineProps<{
  name: string
}>()
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