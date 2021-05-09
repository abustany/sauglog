<template>
  <div class="top-bar">SaugLog</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TopBar',
})
</script>

<style>
.top-bar {
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  background-color: var(--color-accent);
  box-shadow: 0px 5px 5px 0px #9e9e9e;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-title);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
</style>
