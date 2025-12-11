<!-- 카카오 맵과 마커가 선택되었을 때 관광지 정보와 album 선택을 제공 -->

<template>
  <div id="container">
    <div id="mapContainer">
      <div id="map"></div>
      <AlbumScene
        v-if="selectedPlace"
        class="sheet-panel"
        :selected-place="selectedPlace"
        @loaded="clearOverlay"
      />
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
import { onMounted, ref } from 'vue'
import AlbumScene from '@/components/music/AlbumScene.vue'

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

const isLoading = ref(false)

const emit = defineEmits(['click-spot'])

// ✅ 우리가 가진 지역 데이터 (실제론 props로 받아도 됨)
const attractions = [
  {
    attractions_id: 1,
    name: '서울시청',
    description: '서울시청입니다',
    image: '/src/assets/img/seoulCityHall.webp',
    latitude: 37.5665,
    longitude: 126.978,
  },
]

// 선택 장소
const selectedPlace = ref(null)

const initMap = function () {
  const container = document.getElementById('map')
  const options = {
    // eslint-disable-next-line
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  }

  // eslint-disable-next-line
  const map = new kakao.maps.Map(container, options)

  // 🔥 1) 우리가 가진 데이터로 마커 생성
  attractions.forEach((attraction) => {
    // eslint-disable-next-line
    const markerPos = new kakao.maps.LatLng(attraction.latitude, attraction.longitude)
    // eslint-disable-next-line
    const marker = new kakao.maps.Marker({
      position: markerPos,
      map,
    })

    // 🔥 2) 마커 클릭 이벤트 → Vue 상태 변경
    // eslint-disable-next-line
    kakao.maps.event.addListener(marker, 'click', () => {
      isLoading.value = true
      selectedPlace.value = attraction
      emit('click-spot', selectedPlace.value)
    })
  })
}

const clearOverlay = () => {
  isLoading.value = false
}

onMounted(() => {
  // 이미 SDK가 로드되어 있다면 그대로 사용
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    // 아직 로드 안 됨 → script 로드
    const script = document.createElement('script')
    // http 말고 https 혹은 // 권장
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`
    script.onload = () => {
      // eslint-disable-next-line
      kakao.maps.load(initMap)
    }
    document.head.appendChild(script)
  }
})
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

/* 🔥 바텀 시트 위치 */
.sheet-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  /* 원하는 높이 (조정 가능) */
  height: 90vh;

  z-index: 10;
  /* 지도 위 덮도록 */
  pointer-events: auto;
}

/* =========================
   Vue <Transition name="sheet"> 규칙
   ========================= */

/* 처음 들어올 때 시작 상태, 나갈 때 끝 상태 */
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%); /* 화면 아래에 숨겨진 상태 */
  opacity: 0;
}

/* 트랜지션 동안 적용 */
.sheet-enter-active,
.sheet-leave-active {
  transition:
    transform 0.4s ease-out,
    opacity 0.3s ease-out;
}

/* 들어올 때 끝 상태, 나갈 때 시작 상태 */
.sheet-enter-to,
.sheet-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.loading-overlay {
  position: absolute;
  inset: 0; /* top, right, bottom, left 모두 0 */
  z-index: 20; /* 바텀시트(z-index:10)보다 위로 */
  background: rgba(0, 0, 0, 0.35); /* ✅ 화면 어둡게 효과 */
  backdrop-filter: blur(2px); /* 선택: 약간의 블러 효과 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease; /* 부드럽게 나타났다가 사라지게 */
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
