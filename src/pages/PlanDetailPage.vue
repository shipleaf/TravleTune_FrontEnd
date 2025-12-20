<template>
  <div class="page">
    <HeaderBar />

    <div class="map-attractions-container">
      <!-- ✅ 왼쪽: 검색 + 리스트 -->
      <div>
        <TripDetailSidebar />
      </div>
      <!-- ✅ 오른쪽: 지도 -->
      <section class="map-wrap">
        <div id="map"></div>
      </section>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '@/components/common/HeaderBar.vue'
import TripDetailSidebar from '@/components/plan/TripDetailSidebar.vue'
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
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ✅ 전체 레이아웃: 좌(패널) + 우(지도) */
.map-attractions-container {
  flex: 1;
  display: grid;
  grid-template-columns: 380px 1fr; /* 왼쪽 고정폭 + 오른쪽 가변 */
  gap: 16px;
  padding: 16px;
  min-height: 0; /* 스크롤 영역 위해 중요 */
  background: #0b0f1a;
}

/* ✅ 왼쪽 패널 */
.panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.panel__header {
  padding: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.search__icon {
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.8);
}

.search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #fff;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.55);
  }
}

.search__clear {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.chips {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  font-size: 12px;
}
.chip--active {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.18);
}

.panel__list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 10px;
}

.empty {
  padding: 18px;
  border-radius: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.85);
}
.empty__title {
  font-weight: 700;
  margin-bottom: 6px;
}
.empty__desc {
  font-size: 13px;
  opacity: 0.8;
}

/* ✅ 여행지 카드 */
.place {
  width: 100%;
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: 12px;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.12s ease,
    background 0.12s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.09);
  }
}

.place__thumb {
  width: 76px;
  height: 76px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.place__body {
  min-width: 0;
}

.place__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.place__title {
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place__badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
}

.place__desc {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.place__meta {
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  display: flex;
  align-items: center;
  gap: 6px;
}
.dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  display: inline-block;
}

.panel__footer {
  padding: 12px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.primary {
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #0b0f1a;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.9);
}

/* ✅ 지도 영역 */
.map-wrap {
  min-height: 0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

#map {
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
