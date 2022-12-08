import { createRouter, createWebHistory } from 'vue-router'
import LoadVue from '../pages/Load/Load.vue'
import General from '../pages/Analytics/General/General.vue'
import WordTraking from '../pages/Analytics/WordTraking.vue'
import Words from '../pages/Analytics/Words/Words.vue'
import Vocabulary from '../pages/Analytics/Vocabulary.vue'
import Messages from '../pages/Analytics/Messages.vue'
import Chats from '../pages/Analytics/Chats.vue'
import ReplayTime from '../pages/Analytics/ReplayTime.vue'



const routes = [
  {
    path: '/',
    component: LoadVue
  },
  {
    path: '/analytics',
    component: General,
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Общие', layoutTitleOrder: 10 }
  },
  {
    path: '/analytics/word-traking',
    alias: '/analytics/word-traking/:word',
    name: 'word-traking',
    component: WordTraking,
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Остлеживание слова', layoutTitleOrder: 20 }
  },
  {
    path: '/analytics/words',
    component: Words,
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Слова', layoutTitleOrder: 30 }
  },
  {
    path: '/analytics/vocabulary',
    component: Vocabulary,
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Словарный запас', layoutTitleOrder: 40 }
  },
  {
    path: '/analytics/messages',
    component: Messages,
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Сообщения', layoutTitleOrder: 50 }
  },
  {
    path: '/analytics/chats',
    component: Chats,
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Собеседники', layoutTitleOrder: 60 }
  },
  {
    path: '/analytics/replay-time',
    component: ReplayTime,
    meta: { layout: 'AnalyticsLayout', layoutTitle: 'Вермя ответа', layoutTitleOrder: 70 }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
