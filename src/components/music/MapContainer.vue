<template>
  <div id="container">
    <div id="mapContainer">
      <div id="map"></div>
      <div v-show="isLoading" class="loading-overlay">
        <div class="loader">
          <div class="bar bar1"></div>
          <div class="bar bar2"></div>
          <div class="bar bar3"></div>
          <div class="bar bar4"></div>
          <div class="bar bar5"></div>
          <div class="bar bar6"></div>
          <div class="bar bar7"></div>
          <div class="bar bar8"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import { useSpotStore } from '@/stores/spot'
import { storeToRefs } from 'pinia'

const store = useSpotStore()
const { setSelectedSpot } = store
const { spots } = storeToRefs(store)

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

const isLoading = ref(false)
const map = ref(null)
const markers = ref([])
const overlays = ref([])
const overlayTimers = ref([])

const clearMarkers = () => {
  markers.value.forEach((m) => m.setMap && m.setMap(null))
  overlays.value.forEach((o) => o.setMap && o.setMap(null))
  overlayTimers.value.forEach((t) => t && clearTimeout(t))
  markers.value = []
  overlays.value = []
  overlayTimers.value = []
}

const renderMarkers = () => {
  if (!map.value || !spots.value) return

  clearMarkers()

  // eslint-disable-next-line
  const bounds = new kakao.maps.LatLngBounds()

  spots.value.forEach((spot) => {
    if (!spot.latitude || !spot.longitude) return

    // eslint-disable-next-line
    const position = new kakao.maps.LatLng(Number(spot.latitude), Number(spot.longitude))
    // eslint-disable-next-line
    const marker = new kakao.maps.Marker({
      position,
      map: map.value,
    })

    const overlay = new kakao.maps.CustomOverlay({
      position,
      yAnchor: 1.9,
      zIndex: 10,
      clickable: false,
      content: `<div class="marker-tooltip">${spot.title ?? ''}</div>`,
    })

    let hideTimer = null

    // eslint-disable-next-line
    kakao.maps.event.addListener(marker, 'mouseover', () => {
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
      overlay.setMap(map.value)
    })
    // eslint-disable-next-line
    kakao.maps.event.addListener(marker, 'mouseout', () => {
      hideTimer = setTimeout(() => {
        overlay.setMap(null)
      }, 120)
    })
    // eslint-disable-next-line
    kakao.maps.event.addListener(marker, 'click', () => {
      setSelectedSpot(spot)
    })

    markers.value.push(marker)
    overlays.value.push(overlay)
    overlayTimers.value.push(hideTimer)
    bounds.extend(position)
  })

  if (spots.value.length > 0) {
    map.value.setBounds(bounds)
  }
}

const initMap = function () {
  const container = document.getElementById('map')
  const options = {
    // eslint-disable-next-line
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 7,
  }

  // eslint-disable-next-line
  map.value = new kakao.maps.Map(container, options)
  renderMarkers()
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`
    script.onload = () => {
      // eslint-disable-next-line
      kakao.maps.load(initMap)
    }
    document.head.appendChild(script)
  }
})

onBeforeUnmount(() => {
  clearMarkers()
})

watch(
  spots,
  () => {
    renderMarkers()
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100%;
  display: flex;
}

#mapContainer {
  height: 100%;
  position: relative;
  display: flex;
  flex: 1;
}

#map {
  height: 100%;
  flex: 1;
}

.marker-tooltip {
  padding: 8px 10px;
  border-radius: 8px;
  background: #0f172a;
  color: #f8fafc;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  margin-bottom: 6px;
}

.sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90vh;
  z-index: 10;
  pointer-events: auto;
}

.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition:
    transform 0.4s ease-out,
    opacity 0.3s ease-out;
}

.sheet-enter-to,
.sheet-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 20;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.loader {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

.bar {
  width: 10px;
  height: 70px;
  background: hsl(0, 100%, 50%);
  display: inline-block;
  transform-origin: bottom center;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  animation: loader8913 1.2s linear infinite;
}

.bar1 {
  animation-delay: 0.1s;
}

.bar2 {
  animation-delay: 0.2s;
}

.bar3 {
  animation-delay: 0.3s;
}

.bar4 {
  animation-delay: 0.4s;
}

.bar5 {
  animation-delay: 0.5s;
}

.bar6 {
  animation-delay: 0.6s;
}

.bar7 {
  animation-delay: 0.7s;
}

.bar8 {
  animation-delay: 0.8s;
}

@keyframes loader8913 {
  0% {
    transform: scaleY(0.1);
  }

  50% {
    transform: scaleY(1);
    background: yellowgreen;
  }

  100% {
    transform: scaleY(0.1);
    background: transparent;
  }
}
</style>
