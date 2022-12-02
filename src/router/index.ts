import { createRouter, createWebHistory } from 'vue-router'
import LoadVue from '../pages/Load/Load.vue'

const routes = [
  {
    path: '/',
    component: LoadVue
  },
  {
    path: '/analytics',
    component: () => import('../pages/Analytics/General.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/word-traking',
    component: () => import('../pages/Analytics/WordTraking.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/words',
    component: () => import('../pages/Analytics/Words.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/vocabulary',
    component: () => import('../pages/Analytics/Vocabulary.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/messages',
    component: () => import('../pages/Analytics/Messages.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/chats',
    component: () => import('../pages/Analytics/Chats.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
