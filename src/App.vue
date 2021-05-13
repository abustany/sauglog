<template>
  <TopBar
    :needsRefresh="needRefresh"
    :updateServiceWorker="() => { updateServiceWorker(true) }" />
  <router-view class="app-content"></router-view>
</template>

<script lang="ts">
import { defineComponent, provide, watchEffect } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

import useLog from './log'
import TopBar from './components/TopBar.vue'

export default defineComponent({
  name: 'App',
  components: {
    TopBar,
  },
  setup() {
    const { addEntry, entries } = useLog()

    provide('addEntry', addEntry)
    provide('entries', entries)

    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

    watchEffect(() => { if (offlineReady) console.log('App is ready to be run offline') })

     return { needRefresh, updateServiceWorker }
  },
})
</script>

<style>
:root {
  --color-text: #0f0f04;
  --color-bg: #ebe9ee;
  --color-bg-dark: #908e91;
  --color-accent: #ebe96c;

  --font-size-title: 22pt;
  --font-size-base: 16pt;
  --font-size-small: 12pt;
}

html {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: sans-serif;
  font-size: var(--font-size-base);
}

#app {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1 1 auto;
  overflow: auto;
}

input[type='button'] {
  font-size: var(--font-size-base);
  background-color: transparent;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid var(--color-bg-dark);
  border-left: 0;
  cursor: pointer;
}
</style>
