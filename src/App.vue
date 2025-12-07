<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink to="/" class="brand">TravelTune</RouterLink>
      <nav class="nav">
        <RouterLink to="/travel-plan">여행계획</RouterLink>
        <RouterLink to="/music">음악추천</RouterLink>
        <RouterLink to="/mypage">마이페이지</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #f4f6ff, #ffffff);
  color: #0f172a;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffffcc;
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
}

.brand {
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 1.25rem;
  color: #0f172a;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav a {
  color: #334155;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.nav a.router-link-active {
  background: #0f172a;
  color: #f8fafc;
}

.nav a:hover {
  background: #e2e8f0;
}

.app-main {
  width: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}
</style>
