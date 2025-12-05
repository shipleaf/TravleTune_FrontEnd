<template>
  <div id="container">
    <div id="map" style="width: 500px; height: 400px"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

const initMap = function () {
  const container = document.getElementById('map')
  const options = {
    // eslint-disable-next-line
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  }

  // eslint-disable-next-line
  const map = new kakao.maps.Map(container, options)
}

onMounted(() => {
  // 이미 SDK가 로드되어 있다면 그대로 사용
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    // 아직 로드 안 됨 → script 로드
    const script = document.createElement('script')
    script.src = `http://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}`
    script.onload = () => {
      // eslint-disable-next-line
      kakao.maps.load(initMap)
    }
    document.head.appendChild(script)
  }
})
</script>

<style lang="scss" scoped></style>
