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
    name: 'Home',
    component: AnalyticsVue
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
