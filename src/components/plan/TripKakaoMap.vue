<template>
  <div id="map" class="map"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useTripSelectionStore } from '@/stores/tripSelection'

const selStore = useTripSelectionStore()

const props = defineProps({
  places: { type: Array, default: () => [] }, // itinerary 배열
})

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY

let tooltipOverlay = null
const suppressAutoFit = ref(false)
let suppressTimer = null

const map = ref(null)
let markers = []
let polyline = null
let infoOverlay = null
let tooltipHideTimer = null

const closeInfoOverlay = () => {
  if (infoOverlay) {
    infoOverlay.setMap(null)
    infoOverlay = null
  }
}

const clearMapObjects = () => {
  markers.forEach((m) => m.setMap(null))
  markers = []

  if (polyline) {
    polyline.setMap(null)
    polyline = null
  }
  if (tooltipOverlay) {
    tooltipOverlay.setMap(null)
    tooltipOverlay = null
  }
  closeInfoOverlay()
}

const fitBounds = (path) => {
  const bounds = new kakao.maps.LatLngBounds()
  path.forEach((latlng) => bounds.extend(latlng))

  // ✅ 레이아웃 반영(특히 flex/hidden에서 중요)
  map.value.relayout()

  // ✅ bounds 적용
  map.value.setBounds(bounds)

  // ✅ 혹시 bounds가 씹히는 케이스 방지(다음 프레임에 한 번 더)
  requestAnimationFrame(() => {
    map.value.setBounds(bounds)
  })
}

const openPlace = (place, { zoom = true, openCard = true } = {}) => {
  if (!place || !map.value) return

  const position = new kakao.maps.LatLng(Number(place.latitude), Number(place.longitude))

  // 자동 fit 방지(지금 쓰던 로직 재사용)
  suppressAutoFit.value = true
  if (suppressTimer) clearTimeout(suppressTimer)
  suppressTimer = setTimeout(() => (suppressAutoFit.value = false), 800)

  // tooltip 제거
  if (tooltipOverlay) {
    tooltipOverlay.setMap(null)
    tooltipOverlay = null
  }

  // 기존 카드 닫기
  closeInfoOverlay()

  // ✅ 이동 + 확대
  if (zoom) {
    const targetLevel = 4
    map.value.setLevel(targetLevel, { animate: true })
    // setLevel 직후 panTo가 씹히는 케이스가 있어서 약간 딜레이/프레임 넘기기
    requestAnimationFrame(() => {
      map.value.panTo(position)
    })
  } else {
    map.value.panTo(position)
  }

  // ✅ 카드 열기
  if (openCard) {
    const cardEl = document.createElement('div')
    cardEl.className = 'place-card'
    cardEl.innerHTML = `
      <button class="place-card__close" type="button" aria-label="닫기">×</button>
      <div class="place-card__title">${place.attraction_title}</div>
      <div class="place-card__meta">
        <span class="place-card__badge">${place.cat3 ?? ''}</span>
        <span class="place-card__time">${place.start_time ?? ''} - ${place.end_time ?? ''}</span>
      </div>
    `

    infoOverlay = new kakao.maps.CustomOverlay({
      position,
      content: cardEl,
      yAnchor: 1.5,
      zIndex: 1000,
    })
    infoOverlay.setMap(map.value)

    cardEl.querySelector('.place-card__close')?.addEventListener('click', (ev) => {
      ev.stopPropagation()
      closeInfoOverlay()
    })
  }
}

const drawRoute = (places) => {
  console.log('[drawRoute] places:', places)
  if (!map.value) return
  clearMapObjects()

  const valid = (places ?? [])
    .map((p) => ({
      ...p,
      lat: Number(p.latitude),
      lng: Number(p.longitude),
    }))
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))

  if (!valid.length) return

  const path = valid.map((p) => new kakao.maps.LatLng(p.lat, p.lng))

  valid.forEach((p) => {
    const position = new kakao.maps.LatLng(p.lat, p.lng)

    const el = document.createElement('div')
    el.className = 'marker'
    el.innerHTML = `<div class="marker__circle">${p.visit_order}</div>`

    const overlay = new kakao.maps.CustomOverlay({
      position,
      content: el,
      yAnchor: 1,
      xAnchor: 0.5,
    })
    overlay.setMap(map.value)
    markers.push(overlay)

    // ✅ hover tooltip overlay (별도)
    el.addEventListener('mouseenter', () => {
      if (tooltipHideTimer) clearTimeout(tooltipHideTimer)

      if (tooltipOverlay) tooltipOverlay.setMap(null)

      const tipEl = document.createElement('div')
      tipEl.className = 'marker-tooltip'
      tipEl.textContent = p.attraction_title

      tooltipOverlay = new kakao.maps.CustomOverlay({
        position,
        content: tipEl,
        yAnchor: 3.0,
        zIndex: 999,
      })
      tooltipOverlay.setMap(map.value)
    })

    el.addEventListener('mouseleave', () => {
      tooltipHideTimer = setTimeout(() => {
        if (tooltipOverlay) {
          tooltipOverlay.setMap(null)
          tooltipOverlay = null
        }
      }, 80) // 60~120ms 추천
    })

    el.addEventListener('click', (e) => {
      e.stopPropagation()
      selStore.select(p.itinerary_id, 'map')
      openPlace(p, { zoom: true, openCard: true })
    })

    el.addEventListener('mouseleave', () => {
      if (tooltipOverlay) {
        tooltipOverlay.setMap(null)
        tooltipOverlay = null
      }
    })
  })

  // ✅ 점선(대시) 폴리라인
  polyline = new kakao.maps.Polyline({
    path,
    strokeWeight: 4,
    strokeColor: '#46a0ff',
    strokeOpacity: 0.9,
    strokeStyle: 'dashed', // 점선 :contentReference[oaicite:0]{index=0}
  })
  polyline.setMap(map.value)
  // ✅ 화면에 다 보이게 bounds 맞추기
  console.log(
    'path:',
    valid.map((v) => [v.lat, v.lng]),
  )
  console.log('center(before):', map.value.getCenter().getLat(), map.value.getCenter().getLng())

  if (!suppressAutoFit.value) {
    fitBounds(path)
  }
  setTimeout(() => {
    const c = map.value.getCenter()
    console.log('center(after):', c.getLat(), c.getLng())
  }, 200)
}

const pendingPlaces = ref([])

watch(
  () => [selStore.selectedItineraryId, selStore.selectedFrom, selStore.selectedPlace],
  ([id, from, place]) => {
    if (!map.value || from !== 'sidebar') return

    let target = place

    if (!target && id) {
      target = props.places?.find((p) => p.itinerary_id === id)
    }
    if (!target) return

    openPlace(target, { zoom: true, openCard: true })
  },
)

watch(
  () => props.places,
  (v) => {
    console.log(props.places)
    pendingPlaces.value = v ?? []
    if (map.value) drawRoute(pendingPlaces.value)
  },
  { deep: true, immediate: true },
)

const initMap = () => {
  const container = document.getElementById('map')
  map.value = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(36.681833506714135, 127.78791104335984),
    level: 6,
  })

  kakao.maps.event.addListener(map.value, 'click', () => {
    closeInfoOverlay()
  })

  // ✅ 맵 준비 후, pending 그리기
  drawRoute(pendingPlaces.value)
}

onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap()
  } else {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`
    script.onload = () => kakao.maps.load(initMap)
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

:global(.marker) {
  cursor: pointer;
}

:global(.marker__circle) {
  width: 28px;
  height: 28px;
  border-radius: 999px;

  background: linear-gradient(135deg, #46a0ff, #6f7bff);
  color: white;

  font-size: 13px;
  font-weight: 900;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    0 6px 14px rgba(70, 160, 255, 0.45),
    0 0 0 3px rgba(255, 255, 255, 0.9);
}

:global(.marker-tooltip) {
  padding: 8px 10px;
  border-radius: 10px;

  background: rgba(0, 0, 0, 0.85);
  color: #fff;

  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;

  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.35);
}

/* (선택) 카카오 인포윈도우 기본 테두리/배경 지우고 싶으면 */
:global(.marker-tooltip) {
  border: 1px solid rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

:global(.place-card) {
  min-width: 220px;
  max-width: 280px;
  padding: 12px 12px 10px;
  border-radius: 14px;

  background: rgba(10, 12, 18, 0.92);
  color: rgba(255, 255, 255, 0.95);

  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.45);

  backdrop-filter: blur(10px);
  pointer-events: auto; /* 중요: 클릭 가능하게 */
  position: relative;
}

:global(.place-card__close) {
  position: absolute;
  top: 8px;
  right: 8px;

  width: 28px;
  height: 28px;
  border-radius: 10px;

  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.95);

  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

:global(.place-card__title) {
  padding-right: 34px;
  font-weight: 900;
  font-size: 14px;
  line-height: 1.25;
}

:global(.place-card__meta) {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 12px;
  opacity: 0.9;
}

:global(.place-card__badge) {
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(70, 160, 255, 0.18);
  border: 1px solid rgba(70, 160, 255, 0.25);
  font-weight: 800;
}

:global(.place-card__time) {
  opacity: 0.85;
}
</style>
