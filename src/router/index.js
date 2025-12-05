import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from '../pages/WelcomePage.vue'
import AuthPage from '../pages/AuthPage.vue'
import ExtraInfoPage from '../pages/ExtraInfoPage.vue'
import TravelPlanPage from '../pages/TravelPlanPage.vue'
import MusicRecommendationPage from '../pages/MusicRecommendationPage.vue'
import MyPage from '../pages/MyPage.vue'
import SpotifySuccess from '@/pages/SpotifySuccess.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: AuthPage,
      props: { mode: 'login' },
    },
    {
      path: '/signup',
      name: 'signup',
      component: AuthPage,
      props: { mode: 'signup' },
    },
    {
      path: '/extra-info',
      name: 'extra-info',
      component: ExtraInfoPage,
    },
    {
      path: '/travel-plan',
      name: 'travel-plan',
      component: TravelPlanPage,
    },
    {
      path: '/music',
      name: 'music',
      component: MusicRecommendationPage,
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage,
    },
    {
      path: '/spotify-success',
      name: 'spotify-success',
      component: SpotifySuccess,
    },
  ],
})

export default router
