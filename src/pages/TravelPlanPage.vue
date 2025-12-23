<template>
  <div class="app-page">
    <HeaderBar />
    <div class="app-main">
      <div class="page-info">
        <div class="page-title">내 여행</div>
        <div class="page-desc">TravelTune 친구들과 나만의 여행을 계획해 보세요!</div>
      </div>

      <div class="contents">
        <TravelPlanning />
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/common/HeaderBar.vue'
import TravelPlanning from '@/components/plan/TravelPlanning.vue'
</script>

<style lang="scss" scoped>
.app-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  width: 100%;
  padding: 0 20%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.page-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contents {
  padding: 24px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.page-desc {
  font-size: 1rem;
  color: oklch(0.65 0.02 240);
}
</style>
