import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CancerChartView from '../views/CancerChartView.vue'
import UVIndicatorView from '../views/UVIndicatorView.vue'
import RecommendationView from '../views/RecommendationView.vue'
import ReminderView from '../views/ReminderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cancer-chart',
      name: 'cancer-chart',
      component: CancerChartView,
    },
    {
      path: '/uv-indicator',
      name: 'uv-indicator',
      component: UVIndicatorView,
    },
    {
      path: '/recommendation',
      name: 'recommendation',
      component: RecommendationView,
    },
    {
      path: '/reminder',
      name: 'reminder',
      component: ReminderView,
    },
  ],
})

export default router
