import { createApp } from 'vue'
import * as VueRouter from 'vue-router'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

import App from './App.vue'
import EditEntry from './components/EditEntry.vue'
import Log from './components/Log.vue'
import { parseKey } from './log'

const routes: VueRouter.RouteRecordRaw[] = [
  { path: '/', component: Log },
  { name: 'add-entry', path: '/add', component: EditEntry },
  {
    name: 'edit-entry',
    path: '/edit/:id',
    component: EditEntry,
    props: route => ({ id: parseKey(route.params.id as string) }),
  },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
})

router.afterEach((to, from) => {
  if (to.path === from.path || !((from as any).href)) { // initial loading
    to.meta.transitionName = ''
    return
  }

  const toDepth = to.path === '/' ? 0 : to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})

const i18n = createI18n({
  locale: navigator.language,
  messages
})

createApp(App)
  .use(i18n)
  .use(router)
  .mount('#app')
