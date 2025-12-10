<template>
  <div class="app-page">
    <HeaderBar />

    <div class="app-main">
      <SideBar :selected-spot="selectedSpot" @select-spot="handleSelectSpot" />
      <MapArea :selected-spot="selectedSpot" class="mapContainer" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HeaderBar from '@/components/common/HeaderBar.vue'
import SideBar from '@/components/music/SideBar.vue'
import MapArea from '@/components/music/MapArea.vue'

const selectedSpot = ref(null)

function handleSelectSpot(spot) {
  selectedSpot.value = spot
}
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
