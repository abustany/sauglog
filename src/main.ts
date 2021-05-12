import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

import App from './App.vue'
import AddEntry from './components/AddEntry.vue'
import Log from './components/Log.vue'

const log = {}

const routes = [
  { path: '/', component: Log },
  { name: 'add-entry', path: '/add', component: AddEntry },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

const i18n = createI18n({
  locale: navigator.language,
  messages
})

createApp(App)
  .use(i18n)
  .use(router)
  .provide('log', log)
  .mount('#app')
