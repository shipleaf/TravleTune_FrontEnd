<template>
  <div class="app-page">
    <HeaderBar />

    <div class="app-main">
      <SideBar />
      <MapArea class="mapContainer" />
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
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  display: flex;
  min-height: 0;
}

.mapContainer {
  flex: 1;
  min-width: 0;
}
</style>
