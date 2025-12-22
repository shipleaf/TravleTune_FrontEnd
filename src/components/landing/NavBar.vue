<template>
  <header class="navbar">
    <nav class="nav">
      <!-- glow layer -->
      <div class="nav__glow" aria-hidden="true"></div>

      <div class="nav__inner">
        <div class="nav__row">
          <!-- Left: logo (원래 Link만 있었음) -->
          <RouterLink to="/" class="nav__brand">
            <!-- 필요하면 로고/텍스트 넣으세요 -->
            <span class="nav__brandText">TravelTune</span>
          </RouterLink>

          <!-- Desktop links -->
          <div class="nav__links">
            <RouterLink to="/artists" class="nav__link">Artists</RouterLink>
          </div>

          <!-- Desktop actions -->
          <div class="nav__actions">
            <button type="button" class="nav__ghostBtn">Sign In</button>

            <!-- AnimatedButton은 아래에 간단 Vue 버전 같이 드림 -->
            <AnimatedButton href="/get-started" size="sm"> Get Started </AnimatedButton>
          </div>

          <!-- Mobile toggle -->
          <button
            type="button"
            class="nav__iconBtn"
            @click="toggleMenu"
            aria-label="Toggle menu"
            :aria-expanded="isMenuOpen ? 'true' : 'false'"
          >
            <!-- lucide 아이콘 대신 간단 SVG (원하면 lucide-vue-next로 교체 가능) -->
            <svg v-if="!isMenuOpen" viewBox="0 0 24 24" class="nav__icon">
              <path fill="currentColor" d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="nav__icon">
              <path
                fill="currentColor"
                d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.3-6.3z"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="mobile">
        <div class="mobile__inner">
          <RouterLink to="/services" class="mobile__link" @click="closeMenu">Services</RouterLink>
          <RouterLink to="/artists" class="mobile__link purple" @click="closeMenu"
            >Artists</RouterLink
          >
          <RouterLink to="/success-stories" class="mobile__link green" @click="closeMenu">
            Success Stories
          </RouterLink>
          <RouterLink to="/contact" class="mobile__link orange" @click="closeMenu"
            >Contact</RouterLink
          >

          <div class="mobile__divider"></div>

          <AnimatedButton href="/get-started" class="mobile__cta" @click="closeMenu">
            로그인
          </AnimatedButton>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AnimatedButton from './AnimatedButton.vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style lang="scss" scoped>
.navbar {
  position: fixed;
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 50;
  margin: 0 auto;
  max-width: 1280px;
}

.nav {
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  background: rgba(17, 24, 39, 0.6); // gray-900/60
  backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);

  animation: borderCycle 4s linear infinite;
}

/* Animated border glow overlay */
.nav__glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  animation: glowCycle 4s linear infinite;
}

.nav__inner {
  position: relative;
  z-index: 1;
  padding: 0 24px;

  @media (min-width: 1024px) {
    padding: 0 32px;
  }
}

.nav__row {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.nav__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.nav__brandText {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.nav__links {
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 32px;
  }
}

.nav__link {
  font-size: 13px;
  color: rgba(209, 213, 219, 1); // gray-300
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: rgba(192, 132, 252, 1); // purple-400
  }
}

.nav__actions {
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.nav__ghostBtn {
  background: transparent;
  border: 0;
  color: rgba(209, 213, 219, 1);
  font-size: 13px;
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 10px;
  transition:
    color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.06);
  }
}

.nav__iconBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;

  background: transparent;
  border: 0;
  cursor: pointer;
  color: rgba(209, 213, 219, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  @media (min-width: 768px) {
    display: none;
  }
}

.nav__icon {
  width: 20px;
  height: 20px;
}

/* Mobile panel */
.mobile {
  border-top: 1px solid rgba(55, 65, 81, 0.5); // gray-700/50
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(12px);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;

  @media (min-width: 768px) {
    display: none;
  }
}

.mobile__inner {
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile__link {
  color: rgba(209, 213, 219, 1);
  text-decoration: none;
  font-size: 14px;
  padding: 6px 2px;

  &:hover {
    color: rgba(96, 165, 250, 1); // blue-400
  }

  &.purple:hover {
    color: rgba(192, 132, 252, 1);
  }
  &.green:hover {
    color: rgba(74, 222, 128, 1);
  }
  &.orange:hover {
    color: rgba(251, 146, 60, 1);
  }
}

.mobile__divider {
  height: 1px;
  background: rgba(55, 65, 81, 1);
  margin-top: 4px;
}

.mobile__cta {
  width: 100%;
}

/* Border / glow keyframes */
@keyframes borderCycle {
  0% {
    border-color: rgba(59, 130, 246, 0.3);
  }
  25% {
    border-color: rgba(147, 51, 234, 0.3);
  }
  50% {
    border-color: rgba(236, 72, 153, 0.3);
  }
  75% {
    border-color: rgba(34, 197, 94, 0.3);
  }
  100% {
    border-color: rgba(59, 130, 246, 0.3);
  }
}

@keyframes glowCycle {
  0% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }
  25% {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
  }
  75% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
  }
  100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }
}
</style>
