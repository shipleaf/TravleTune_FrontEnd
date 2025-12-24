import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from '../pages/WelcomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegistPage from '@/pages/RegistPage.vue'
import ExtraInfoPage from '../pages/ExtraInfoPage.vue'
import TravelPlanPage from '../pages/TravelPlanPage.vue'
import MusicRecommendationPage from '../pages/MusicRecommendationPage.vue'
import MyPage from '../pages/MyPage.vue'
import SpotifySuccess from '@/pages/SpotifySuccess.vue'
import SignupSuccess from '@/pages/SignupSuccess.vue'
import PlanDetailPage from '@/pages/PlanDetailPage.vue'
import LandingPage from '@/pages/LandingPage.vue'
import FriendPage from '@/pages/FriendPage.vue'
import VideoTest from '@/pages/VideoTest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: WelcomePage,
    },
    {
      path: '/friend',
      name: 'friend',
      component: FriendPage,
    },
    {
      path: '/landing',
      name: 'welcome',
      component: LandingPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      props: { mode: 'login' },
    },
    {
      path: '/signup',
      name: 'signup',
      component: RegistPage,
      props: { mode: 'signup' },
    },
    {
      path: '/signup-success',
      name: 'signup-success',
      component: SignupSuccess,
    },
    {
      path: '/test',
      name: 'test',
      component: VideoTest,
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
      path: '/plan-detail/:plan_id(\\d+)',
      name: 'plan-detail',
      component: PlanDetailPage,
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
