<template>
  <header class="app-header">
    <div class="app-header-inner">
      <div class="app-header-left" @click="handleMain">
        <div class="logo-container">
          <LpSpinner />
        </div>
        <span class="app-logo-text">TravelTunes</span>
      </div>

      <nav class="app-header-nav">
        <SpotifyButton />
        <button type="button" class="app-header-link">Explore</button>
        <button type="button" class="app-header-link">My Playlists</button>
        <button type="button" class="app-header-avatar">
          <img
            v-if="me?.profileImage"
            :src="me.profileImage"
            alt="프로필"
            class="app-header-avatar__img"
            @error="onAvatarError"
          />
          <span v-else class="app-header-avatar__fallback">SY</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import LpSpinner from '@/components/auth/LpSpinner.vue'
import SpotifyButton from './SpotifyButton.vue'
import { useRouter } from 'vue-router'
import { mockMe } from '@/api/memberApi'

const router = useRouter()

const me = ref(null)

const handleMain = () => {
  router.push('/')
}

function onAvatarError(e) {
  e.target.src = '/placeholder-avatar.png'
}

onMounted(async () => {
  const res = await mockMe()
  console.log(res.data.profileImage)
  me.value = res.data
  console.log(me.value.profileImage)
})
</script>

<style scoped>
/* Header */

.app-header {
  width: 100%;
  height: 64px;
  border-bottom: 1px solid var(--border);
  background: color-mix(in oklch, var(--card) 70%, transparent);
  backdrop-filter: blur(16px);
}

.app-header-inner {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  display: flex;
  align-items: center;
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

.app-header-avatar {
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
</style>
