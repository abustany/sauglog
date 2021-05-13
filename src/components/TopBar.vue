<template>
  <div class="top-bar">
    <div>SaugLog</div>
    <div v-if="needsRefresh" class="top-bar-update-available" role="button" @click="updateServiceWorker()">
      <Icon name="info"/> An update is available, click this banner to refresh
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Icon from './Icon.vue'

export default defineComponent({
  name: 'TopBar',
  props: {
    needsRefresh: {type: Boolean, required: true},
    updateServiceWorker: {type: Function, required: true}
  },
  components: {
    Icon
  }
})
</script>

<style>
.top-bar {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  background-color: var(--color-accent);
  box-shadow: 0px 5px 5px 0px #9e9e9e;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-title);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.top-bar-update-available {
  font-size: var(--font-size-small);
  text-align: center;
  margin-top: .5rem;
  cursor: pointer;
}
</style>
