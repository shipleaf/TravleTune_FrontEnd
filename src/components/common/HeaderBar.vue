<template>
  <header class="app-header">
    <div class="app-header-inner">
      <div class="app-header-left" @click="handleMain">
        <div class="logo-container">
          <LpSpinner />
        </div>
        <span class="app-logo-text">TravelTunes</span>
      </div>

      <div class="container">
        <div class="wrap">
          <input
            type="radio"
            id="rd-1"
            name="radio"
            class="rd-1"
            hidden
            :checked="activeTab === 'home'"
          />
          <label for="rd-1" class="label" style="--index: 0" @click.prevent="goTab('home')">
            <span>홈</span>
          </label>

          <input
            type="radio"
            id="rd-2"
            name="radio"
            class="rd-2"
            hidden
            :checked="activeTab === 'music'"
          />
          <label for="rd-2" class="label" style="--index: 1" @click.prevent="goTab('music')">
            <span>음악 추천</span>
          </label>

          <input
            type="radio"
            id="rd-3"
            name="radio"
            class="rd-3"
            hidden
            :checked="activeTab === 'travel'"
          />
          <label for="rd-3" class="label" style="--index: 2" @click.prevent="goTab('travel')">
            <span>내 여행</span>
          </label>

          <div class="bar"></div>
          <div class="slidebar"></div>
        </div>
      </div>

      <nav class="app-header-nav">
        <SpotifyButton />
        <!-- <button type="button" class="app-header-link">Explore</button>
        <button type="button" class="app-header-link">My Playlists</button> -->
        <button type="button" class="app-header-avatar" @click.stop="toggleCard">
          <img
            v-if="myData?.data.profileImage"
            :src="myData.data.profileImage"
            alt="프로필"
            class="app-header-avatar__img"
            @error="onAvatarError"
          />
          <span v-else class="app-header-avatar__fallback">
            {{ (myData?.data.nickname ?? 'SY').slice(0, 2).toUpperCase() }}
          </span>
        </button>
        <Transition name="dropdown" appear>
          <div class="card" v-if="isCardOpen" @click.stop>
            <div class="profile-row">
              <div class="app-header-avatar">
                <img
                  v-if="myData?.data.profileImage"
                  :src="myData.data.profileImage"
                  alt="profile"
                  class="app-header-avatar__img"
                  @error="onAvatarError"
                />
                <span v-else class="app-header-avatar__fallback">
                  {{ (myData?.data.nickname ?? 'SY').slice(0, 2).toUpperCase() }}
                </span>
              </div>

              <div class="user-desc">
                <span class="user-nickname">{{ myData?.data.nickname ?? '사용자' }}</span>
                <span class="user-email">{{ myData?.data.email ?? '' }}</span>
              </div>
            </div>

            <div class="separator"></div>

            <ul class="list">
              <li class="element" @click="handleTravel">
                <Navigation />
                <p class="label">내 여행</p>
              </li>
              <li class="element">
                <Users />
                <p class="label" @click="handleFriendList">친구 목록</p>
              </li>
              <li class="element">
                <CircleUser />
                <p class="label">마이페이지</p>
              </li>
            </ul>

            <div class="separator"></div>
            <ul class="list">
              <li class="element delete" @click="handleLogout">
                <LogOut />
                <p class="label">로그아웃</p>
              </li>
            </ul>
          </div>
        </Transition>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import LpSpinner from '@/components/auth/LpSpinner.vue'
import SpotifyButton from './SpotifyButton.vue'
import { useRouter, useRoute } from 'vue-router'
// import { mockMe as me } from '@/api/memberApi'
import { logout, me } from '@/api/memberApi'
import { Users, LogOut, Navigation, CircleUser } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const activeTab = ref('home')

const syncTabWithRoute = () => {
  if (route.path.startsWith('/music')) activeTab.value = 'music'
  else if (route.path.startsWith('/travel-plan')) activeTab.value = 'travel'
  else activeTab.value = 'home'
}

const goTab = (tab) => {
  activeTab.value = tab
  if (tab === 'home') router.push('/')
  if (tab === 'music') router.push('/music')
  if (tab === 'travel') router.push('/travel-plan')
}

// 라우트가 바뀌면(뒤로가기 포함) 탭도 따라가게
watch(
  () => route.path,
  () => syncTabWithRoute(),
  { immediate: true },
)

const myData = ref(null)

const isCardOpen = ref(false)

const toggleCard = () => {
  isCardOpen.value = !isCardOpen.value
}

const closeCard = () => {
  isCardOpen.value = false
}

function onAvatarError(e) {
  e.target.src = '/placeholder-avatar.png'
}

const onDocClick = () => {
  closeCard()
}

onMounted(async () => {
  try {
    const res = await me()
    myData.value = res.data
    document.addEventListener('click', onDocClick)
  } catch {
    alert('로그인 세션이 만료되었습니다.')
    router.push('/login')
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
})

const handleTravel = () => {
  router.push('/travel-plan')
}

const handleFriendList = () => {
  router.push('/friend')
}

const handleMain = () => {
  router.push('/')
}

const handleLogout = async () => {
  const ok = confirm('정말 로그아웃 하시겠습니까?')
  if (ok) {
    try {
      await logout()
    } catch {
      alert('로그아웃 실패!')
    }
  }
}
</script>

<style scoped>
.mode + .container {
  --color-pure: #000;
  --color-primary: #e8e8e8;
  --color-secondary: #212121;
  --muted: #383838;
}
.mode:checked + .container {
  --color-pure: #000;
  --color-primary: #e8e8e8;
  --color-secondary: #212121;
  --muted: #383838;
}
.container {
  background-color: transparent;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.container .theme {
  color: var(--color-secondary);
  background-color: var(--color-primary);
  position: relative;
  cursor: pointer;
  z-index: 9;
  -webkit-user-select: none;
  user-select: none;
  border: 1px solid var(--muted);
  border-radius: calc(var(--round) - var(--p-y));
  margin-left: calc(var(--p-x) * 2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  transition: background-color 0.25s linear;
}
.container .theme:hover {
  background-color: var(--muted);
}
.container .theme::before {
  content: '';
  position: absolute;
  left: calc(var(--p-x) * -1);
  width: 1px;
  height: 100%;
  background-color: var(--muted);
}
.container .theme span {
  border: none;
  outline: none;
  background-color: transparent;
  padding: 0.125rem;
  border-radius: 9999px;
  align-items: center;
  justify-content: center;
}
.mode:checked + .container .theme span.light,
.mode + .container .theme span.dark {
  display: none;
}
.mode + .container .theme span.light,
.mode:checked + .container .theme span.dark {
  display: flex;
}
.container .theme svg {
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke: currentColor;
  fill: none;
  height: 22px;
  width: 22px;
}

/* main style */
.wrap {
  --round: 10px;
  --p-x: 8px;
  --p-y: 4px;
  --w-label: 100px;
  display: flex;
  align-items: center;
  padding: var(--p-y) var(--p-x);
  position: relative;
  background: tr;
  border-radius: var(--round);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  top: 0;
  z-index: 1;
}

.wrap input {
  height: 0;
  width: 0;
  position: absolute;
  overflow: hidden;
  display: none;
  visibility: hidden;
}

.label {
  cursor: pointer;
  outline: none;
  font-size: 0.875rem;
  letter-spacing: initial;
  font-weight: 500;
  color: var(--color-primary);
  background: transparent;
  padding: 12px 16px;
  width: var(--w-label);
  min-width: var(--w-label);
  text-decoration: none;
  -webkit-user-select: none;
  user-select: none;
  transition: color 0.25s ease;
  outline-offset: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
}
.label span {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.wrap input[class*='rd-']:checked + label {
  color: var(--color-primary);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: absolute;
  transform-origin: 0 0 0;
  height: 100%;
  width: var(--w-label);
  z-index: 0;
  transition: transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98);
}
.bar::before,
.bar::after {
  content: '';
  position: absolute;
  height: 4px;
  width: 100%;
  background: var(--color-primary);
}
.bar::before {
  top: 0;
  border-radius: 0 0 9999px 9999px;
}
.bar::after {
  bottom: 0;
  border-radius: 9999px 9999px 0 0;
}

.slidebar {
  position: absolute;
  height: calc(100% - (var(--p-y) * 4));
  width: var(--w-label);
  border-radius: calc(var(--round) - var(--p-y));
  background: var(--muted);
  transform-origin: 0 0 0;
  z-index: 0;
  transition: transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98);
}

.rd-1:checked ~ .bar,
.rd-1:checked ~ .slidebar,
.rd-1 + label:hover ~ .slidebar {
  transform: translateX(0) scaleX(1);
}
.rd-2:checked ~ .bar,
.rd-2:checked ~ .slidebar,
.rd-2 + label:hover ~ .slidebar {
  transform: translateX(100%) scaleX(1);
}
.rd-3:checked ~ .bar,
.rd-3:checked ~ .slidebar,
.rd-3 + label:hover ~ .slidebar {
  transform: translateX(200%) scaleX(1);
}

.card,
.card * {
  box-sizing: border-box;
}

.card ul,
.card li,
.card p {
  margin: 0;
  padding: 0;
}
.card {
  position: absolute;
  top: 150%;
  right: 0;
  width: 200px;
  z-index: 3;
  /* background-color: rgba(36, 40, 50, 1);
background-image: linear-gradient(135deg, rgba(36, 40, 50, 1) 0%, rgba(36, 40, 50, 1) 40%, rgba(37, 28, 40, 1) 100%); */

  background-color: rgba(36, 40, 50, 1);
  background-image: linear-gradient(
    139deg,
    rgba(36, 40, 50, 1) 0%,
    rgba(36, 40, 50, 1) 0%,
    rgba(37, 28, 40, 1) 100%
  );

  border-radius: 10px;
  padding: 15px 0px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease-out;
}

.card .separator {
  border-top: 1.5px solid #42434a;
}

.card .list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 0px 10px;
}

.card .list .element {
  display: flex;
  align-items: center;
  color: #7e8590;
  gap: 10px;
  transition: all 0.3s ease-out;
  padding: 7px 7px;
  border-radius: 6px;
  cursor: pointer;
}

.card .list .element svg {
  width: 19px;
  height: 19px;
  transition: all 0.3s ease-out;
}

.card .list .element .label {
  font-weight: 600;
}

.card .list .element:hover {
  color: #ffffff;
  transform: translate(1px, -1px);
}
.card .list .delete:hover {
  background-color: #8e2a2a;
}

.card .list .element:active {
  transform: scale(0.99);
}

.card .list:not(:last-child) .element:hover svg {
  stroke: #ffffff;
}

.card .list:last-child svg {
  stroke: #f0883e;
}
.card .list:last-child .element {
  color: #f0883e;
}

.card .list:last-child .element:hover {
  background-color: rgba(56, 45, 71, 0.836);
}

.app-header {
  position: relative;
  width: 100%;
  height: 64px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in oklch, var(--card) 70%, transparent);
  backdrop-filter: blur(16px);
  z-index: 1000;
}

.app-header-inner {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 좌 / 중앙 / 우 */
  align-items: center;
}

.app-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.logo-container {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-container > * {
  transform: scale(0.25);
}

.app-logo-text {
  font-size: 20px;
  font-weight: 600;
}

.app-header-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 16px;
}

.app-header-link {
  font-size: 14px;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 0.15s ease;
  background: none;
  border: none;
}

.app-header-link:hover {
  color: var(--foreground);
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
}

.user-desc {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
}

.user-email {
  font-size: 10px;
  color: #7e8590;
  font-weight: 400;
}

.app-header-avatar {
  position: relative;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid color-mix(in oklch, var(--border) 65%, transparent);
  border-radius: 999px;
  overflow: hidden; /* ✅ 동그라미 밖으로 삐져나오는 거 컷 */
  background: color-mix(in oklch, var(--card) 65%, transparent);
  display: grid;
  place-items: center;
  cursor: pointer;

  /* 기존 효과 유지 */
  box-shadow: 0 12px 24px rgba(56, 189, 248, 0.18);
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.app-header-avatar:hover {
  border-color: color-mix(in oklch, var(--primary) 55%, var(--border));
  box-shadow: 0 14px 30px rgba(56, 189, 248, 0.28);
  transform: translateY(-1px);
}

.app-header-avatar__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* ✅ 비율 안 깨지고 “냅다 꽉 채움” */
  object-position: center;
}

.app-header-avatar__fallback {
  font-size: 12px;
  font-weight: 700;
  color: var(--foreground);
  opacity: 0.9;
}

.app-header-button:hover {
  background: color-mix(in oklch, var(--primary) 90%, white 10%);
  box-shadow: 0 14px 30px rgba(56, 189, 248, 0.35);
  transform: translateY(-1px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
