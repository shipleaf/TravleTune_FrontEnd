<template>
  <div class="app-page">
    <div class="page-header">
      <HeaderBar />
    </div>
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

    <Teleport to="body">
      <div v-if="selectedPlayerSpot" class="album-overlay" @click.self="closeAlbum">
        <div class="album-modal">
          <AlbumScene class="sheet-panel" @loaded="clearOverlay" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useSpotStore } from '@/stores/spot'
import { watch, onBeforeUnmount } from 'vue'

import AlbumScene from '@/components/music/AlbumScene.vue'
import HeaderBar from '@/components/common/HeaderBar.vue'
import SideBar from '@/components/music/SideBar.vue'
import MapArea from '@/components/music/MapArea.vue'

const store = useSpotStore()
const { selectedPlayerSpot } = storeToRefs(store)

const closeAlbum = () => {
  selectedPlayerSpot.value = null
}

const clearOverlay = () => {}

const lockBodyScroll = () => {
  document.body.style.overflow = 'hidden'
}
const unlockBodyScroll = () => {
  document.body.style.overflow = ''
}

watch(
  () => selectedPlayerSpot.value,
  (v) => {
    if (v) lockBodyScroll()
    else unlockBodyScroll()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  unlockBodyScroll()
  selectedPlayerSpot.value = null
  store.deleteSelectedSpot()
})
</script>

<style scoped>
.page-header {
  padding-top: 16px;
  width: 100%;
}
.app-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app-main {
  position: relative;
  width: 100%;
  height: calc(100% - 96px);
  padding: 1% 15% 1%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.album-container {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.contents {
  position: relative;
  width: 100%;
  height: 100%;
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

.album-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;

  /* ✅ 배경만 어둡게 */
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.album-modal {
  width: 100vw;
  height: 100vh;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(10, 10, 10, 0.9);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
}
</style>
