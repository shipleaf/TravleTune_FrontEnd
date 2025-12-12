<!--  -->

<template>
  <!-- 선택된 장소 있을 때 -->
  <main v-if="selectedSpot" class="map-area">
    <img
      class="map-spot-image"
      :src="selectedSpot.image || '/placeholder.svg'"
      :alt="selectedSpot.name"
    />
    <div class="map-spot-overlay"></div>

    <!-- 상단 정보 영역 -->
    <div class="map-spot-top-panel">
      <h1 class="map-spot-title">
        {{ selectedSpot.name }}
      </h1>
      <p class="map-spot-description">
        {{ selectedSpot.description }}
      </p>
    </div>
  </main>

  <!-- 선택된 장소 없을 때 -->
  <main v-else class="map-area">
    <div class="map-placeholder">
      <MapContainer @click-spot="clickSpot" />
    </div>
  </main>
</template>

<script setup>
import MapContainer from './MapContainer.vue'
defineProps({
  selectedSpot: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['click-spot'])

const clickSpot = (spot) => {
  emit('click-spot', spot)
}
</script>

<style scoped>
/* MapArea.vue */
.map-area {
  width: 100%;
  height: 100%; /* 부모(.mapContainer)가 차지한 높이를 그대로 */
  position: relative;
  overflow: hidden;
  background: color-mix(in oklch, var(--background) 70%, black 10%);
  z-index: 1;
}

.map-placeholder {
  padding: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.player-container {
  position: absolute;
  top: 50%;
  right: 2%;
  transform: translateY(-50%);
  width: 600px;
  height: 500px;
}

.map-spot-top-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  padding: 24px 32px;
  max-width: 720px;
}

.map-spot-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  text-shadow: 0 10px 28px rgba(0, 0, 0, 0.7);
  margin-bottom: 8px;
}

.map-spot-description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 6px 18px rgba(0, 0, 0, 0.75);
}

.map-spot-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-spot-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9));
}
</style>
