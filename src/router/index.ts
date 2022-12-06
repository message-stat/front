import { createRouter, createWebHistory } from 'vue-router'
import LoadVue from '../pages/Load/Load.vue'

const routes = [
  {
    path: '/',
    component: LoadVue
  },
  {
    path: '/analytics',
    component: import('../pages/Analytics/General/General.vue'),
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Общие', layoutTitleOrder: 10 }
  },
  {
    path: '/analytics/word-traking',
    component: import('../pages/Analytics/WordTraking.vue'),
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Остлеживание слова', layoutTitleOrder: 20 }
  },
  {
    path: '/analytics/words',
    component: import('../pages/Analytics/Words/Words.vue'),
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Слова', layoutTitleOrder: 30 }
  },
  {
    path: '/analytics/vocabulary',
    component: import('../pages/Analytics/Vocabulary.vue'),
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Словарный запас', layoutTitleOrder: 40 }
  },
  {
    path: '/analytics/messages',
    component: import('../pages/Analytics/Messages.vue'),
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Сообщения', layoutTitleOrder: 50 }
  },
  {
    path: '/analytics/chats',
    component: import('../pages/Analytics/Chats.vue'),
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Собеседники', layoutTitleOrder: 60 }
  },
  {
    path: '/analytics/replay-time',
    component: import('../pages/Analytics/ReplayTime.vue'),
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Вермя ответа', layoutTitleOrder: 70 }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
