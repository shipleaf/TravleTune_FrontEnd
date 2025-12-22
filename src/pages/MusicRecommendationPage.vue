<template>
  <div class="app-page">
    <HeaderBar />

    <div class="app-main">
      <div class="page-info">
        <div class="page-title">음악 추천</div>
        <div class="page-desc">관광지의 분위기에 맞는 음악을 들어보세요</div>
      </div>
      <div class="contents">
        <SideBar />
        <MapArea />
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/common/HeaderBar.vue'
import SideBar from '@/components/music/SideBar.vue'
import MapArea from '@/components/music/MapArea.vue'
</script>

<style scoped>
.app-page {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-main {
  width: 100%;
  padding: 0 15%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.contents {
  display: flex;
}

.page-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
