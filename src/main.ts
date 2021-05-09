import { createApp } from 'vue'
import * as VueRouter from 'vue-router'

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

createApp(App)
  .use(router)
  .provide('log', log)
  .mount('#app')
