<template>
  <!-- 선택된 장소 있을 때 -->
  <main v-if="selectedSpot" class="map-area">
    <img
      class="map-spot-image"
      :src="selectedSpot.image_url || '/placeholder.svg'"
      :alt="selectedSpot.name"
    />
    <div class="map-spot-overlay"></div>

    <!-- 상단 정보 영역 -->
    <div class="map-spot-top-panel">
      <div class="button-container">
        <OpenAlbumButton label="음악으로 떠나보기" clr="#7808d0" @click="renderMusicPlayer" />
      </div>
      <div class="text-area">
        <h1 class="map-spot-title">
          <span v-if="isDetailLoading" class="skeleton skeleton-title"></span>
          <span v-else>{{ selectedSpot.title }}</span>
        </h1>
        <div class="meta-row">
          <span v-if="isDetailLoading" class="skeleton skeleton-line"></span>
          <span v-else>{{ selectedSpot.sido_name }} {{ selectedSpot.gungu_name }}</span>

          <button class="pref-toggle" type="button" @click="togglePref">
            <span class="dot" :class="{ on: applyPreferences }"></span>
            <span>취향 반영 {{ applyPreferences ? 'ON' : 'OFF' }}</span>
          </button>

          <button
            class="like-btn"
            type="button"
            :disabled="isLikeLoading"
            :aria-pressed="!!selectedSpot.is_liked"
            @click="toggleLike"
          >
            <Heart class="like-icon" :class="{ active: selectedSpot.is_liked }" />
            <span class="count">{{ selectedSpot.like_cnt ?? 0 }}</span>
          </button>
        </div>
        <p class="map-spot-description desc-60">
          <span v-if="isDetailLoading" class="skeleton skeleton-multi"></span>
          <span v-else>{{ selectedSpot.description }}</span>
        </p>
      </div>
    </div>
  </main>

  <!-- 선택된 장소 없을 때 -->
  <main v-else class="map-area">
    <div class="map-placeholder">
      <MapContainer />
    </div>
  </main>
</template>

<script setup>
import { Heart } from 'lucide-vue-next'
import OpenAlbumButton from './OpenAlbumButton.vue'
import { storeToRefs } from 'pinia'
import MapContainer from './MapContainer.vue'
import { fetchDetailCommon2, extractDetailCommon2, postAttractionLike } from '@/api/attractions'
import { useSpotStore } from '@/stores/spot'
import { watch, ref } from 'vue'

const store = useSpotStore()
const { selectedSpot, selectedPlayerSpot } = storeToRefs(store)
const { setSelectedSpot } = store
const applyPreferences = ref(true)

const renderMusicPlayer = () => {
  // apply_preferences 전달
  selectedPlayerSpot.value = { ...(selectedSpot.value || {}), apply_preferences: applyPreferences.value }
  console.log(selectedPlayerSpot)
  console.log(selectedPlayerSpot.value)
}

const isDetailLoading = ref(false)
const isLikeLoading = ref(false)

const applySpotPatch = (patch) => {
  if (!selectedSpot.value) return
  setSelectedSpot({ ...selectedSpot.value, ...patch })
}

const loadDetailIfNeeded = async (spot, onCleanup) => {
  if (!spot || spot.description) return
  const contentId = spot.contentId || spot.content_id
  if (!contentId) return
  isDetailLoading.value = true
  let canceled = false
  onCleanup(() => {
    canceled = true
  })
  try {
    const res = await fetchDetailCommon2(contentId)
    if (canceled) return
    const detail = extractDetailCommon2(res)
    applySpotPatch(detail)
  } catch (e) {
    console.error(e)
  } finally {
    if (!canceled) isDetailLoading.value = false
  }
}

const toggleLike = async () => {
  if (!selectedSpot.value?.attraction_id || isLikeLoading.value) return
  isLikeLoading.value = true
  try {
    await postAttractionLike(selectedSpot.value.attraction_id)
    const currentLiked = Boolean(selectedSpot.value.is_liked)
    const currentCount = Number(selectedSpot.value.like_cnt ?? 0)
    const nextLiked = !currentLiked
    const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1)
    applySpotPatch({ is_liked: nextLiked, like_cnt: nextCount })
  } catch (e) {
    console.error(e)
  } finally {
    isLikeLoading.value = false
  }
}

const togglePref = () => {
  applyPreferences.value = !applyPreferences.value
}

watch(
  () => selectedSpot.value,
  async (spot, _, onCleanup) => {
    await loadDetailIfNeeded(spot, onCleanup)
  },
  { immediate: true },
)
</script>

<style scoped>
.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* ✅ pill 버튼: 카드/헤더 톤에 맞춘 유리질감 */
.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  height: 36px;
  padding: 0 12px;
  border-radius: 999px;

  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(10px);

  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;

  transition:
    transform 0.12s ease,
    background 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.like-btn:hover {
  background: rgba(17, 24, 39, 0.5);
  border-color: rgba(236, 72, 153, 0.35);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
}

.like-btn:active {
  transform: translateY(0) scale(0.98);
}

.like-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ✅ 아이콘 */
.like-icon {
  width: 18px;
  height: 18px;
  opacity: 0.9;
  color: rgba(203, 213, 225, 0.95);
  transition:
    color 0.15s ease,
    filter 0.15s ease,
    transform 0.12s ease;
}

/* ✅ 좋아요 상태 */
.like-icon.active {
  color: rgba(236, 72, 153, 0.95);
  filter: drop-shadow(0 8px 16px rgba(236, 72, 153, 0.35));
  transform: translateY(-0.5px);
}

/* ✅ 눌린 상태일 때 버튼도 살짝 핑크 톤 */
.like-btn[aria-pressed='true'] {
  border-color: rgba(236, 72, 153, 0.45);
  background: rgba(236, 72, 153, 0.12);
}

/* ✅ 카운트 */
.like-btn .count {
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.2px;
  opacity: 0.95;
}

.pref-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(17, 24, 39, 0.35);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.pref-toggle:hover {
  background: rgba(17, 24, 39, 0.5);
  border-color: rgba(94, 234, 212, 0.35);
}

.pref-toggle .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.pref-toggle .dot.on {
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2);
}

.skeleton {
  display: inline-block;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.08)
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 6px;
}

.skeleton-title {
  width: 320px;
  height: 28px;
}

.skeleton-line {
  width: 180px;
  height: 14px;
}

.skeleton-multi {
  display: block;
  width: 100%;
  max-width: 520px;
  height: 48px;
  margin-top: 6px;
  border-radius: 10px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
.album-container {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
/* MapArea.vue */
.map-area {
  flex: 1;
  width: 50%;
  height: 70%; /* 부모(.mapContainer)가 차지한 높이를 그대로 */
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
  top: 20%;
  padding: 24px 32px;
  max-width: 100%;

  display: flex;
  flex-direction: column;
}

.map-spot-title {
  width: 100%; /* ✅ 제목은 항상 100% */
}

.text-area {
  max-width: 100%;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.map-spot-description.desc-60 {
  width: 60%;
  max-width: 60%;
  line-height: 1.6; /* 가장 많이 쓰는 값 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9));
}
</style>
