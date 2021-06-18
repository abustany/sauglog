<template>
  <TopBar
    :needsRefresh="needRefresh"
    :updateServiceWorker="() => { updateServiceWorker(true) }" />
  <router-view class="app-content" v-slot="{ Component, route }">
    <transition :name="route.meta.transitionName" @leave="uprootElement">
      <component :is="Component" />
    </transition>
  </router-view>
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
    const { addEntry, updateEntry, deleteEntry, entries } = useLog()

    provide('addEntry', addEntry)
    provide('updateEntry', updateEntry)
    provide('deleteEntry', deleteEntry)
    provide('entries', entries)

    const { offlineReady, needRefresh, updateServiceWorker } = import.meta.env.PROD ?
      useRegisterSW()
      : { offlineReady: true, needRefresh: false, updateServiceWorker: () => {}}

    watchEffect(() => { if (offlineReady) console.log('App is ready to be run offline') })

     return { needRefresh, updateServiceWorker }
  },
  methods: {
    uprootElement(el: HTMLElement) {
      // removes an element from its container into a new layout context, so it
      // can be animated away safely without messing the layout
      if (el.style.position === 'absolute') {
        return
      }

      const rect = el.getBoundingClientRect()
      el.style.position = 'absolute'
      el.style.top = rect.top+'px'
      el.style.left = rect.left+'px'
      el.style.width = rect.width+'px'
      el.style.height = rect.height+'px'
    }
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

body {
  overscroll-behavior-y: contain;
}

a {
  color: inherit;
  text-decoration: none;
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

input[type='button'], button {
  font-size: var(--font-size-base);
  background-color: transparent;
  border-top: 0;
  border-right: 0;
  border-bottom: 1px solid var(--color-bg-dark);
  border-left: 0;
  cursor: pointer;
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: transform .3s ease-out;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform .3s ease-out;
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
