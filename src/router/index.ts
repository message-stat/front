import { createRouter, createWebHistory } from 'vue-router'
import AnalyticsVue from '../pages/Analytics.vue'
import LoadVue from '../pages/Load/Load.vue'

const routes = [
  {
    path: '/',
    component: LoadVue
  },
  {
    path: '/analytics',
    component: () => import('../pages/Analytics.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/words',
    component: () => import('../pages/Analytics.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/words-count',
    component: () => import('../pages/Analytics.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
  {
    path: '/analytics/messages',
    component: () => import('../pages/Analytics.vue'),
    meta: { layout: 'AnalyticsLayout' }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
