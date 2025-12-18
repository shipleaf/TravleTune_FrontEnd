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
        <button type="button" class="app-header-button">Sign In</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import LpSpinner from '@/components/auth/LpSpinner.vue'
import SpotifyButton from './SpotifyButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleMain = () => {
  router.push('/')
}
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

.app-header-button {
  border: none;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: 0 12px 24px rgba(56, 189, 248, 0.25);
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.app-header-button:hover {
  background: color-mix(in oklch, var(--primary) 90%, white 10%);
  box-shadow: 0 14px 30px rgba(56, 189, 248, 0.35);
  transform: translateY(-1px);
}
</style>
