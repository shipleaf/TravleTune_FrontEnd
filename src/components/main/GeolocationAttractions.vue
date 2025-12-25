<template>
  <div class="prompt">
    <label class="prompt__label">주변 추천 관광지</label>
    <span class="prompt__desc">지금 떠나기 좋은 여행지를 둘러보세요</span>
  </div>
  <div class="carousel" @mouseenter="pause" @mouseleave="resume">
    <div class="viewport" ref="viewportRef">
      <div class="track" ref="trackRef" :style="trackStyle">
        <article v-for="spot in displaySpots" :key="spot._key" class="card">
          <img class="img" :src="spot.image" :alt="spot.title" />
          <div class="overlay"></div>

          <div class="like-badge" aria-label="likes">
            <span class="like-icon"><Heart /></span>
            <span class="like-count">{{ spot.likeCount ?? 0 }}</span>
          </div>

          <div class="meta">
            <h3 class="title">{{ spot.title }}</h3>
            <p class="addr">{{ spot.addr1 }} {{ spot.addr2 }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { fetchSpots } from '@/api/attractions'
import { Heart } from 'lucide-vue-next'

const spots = ref([])
const viewportRef = ref(null)
const trackRef = ref(null)
let rafId = null
const speed = 0.6 // px per frame
const offset = ref(0)
const halfWidth = ref(0)
const PAGE_SIZE = 10

const load = async () => {
  try {
    const res = await fetchSpots({
      sidoCode: 5, // 부산
      gunguCode: 1, // 중구
      size: PAGE_SIZE,
    })
    const payload = res?.data?.data?.attractions ?? res?.data?.data ?? res?.data ?? []
    spots.value = (payload || []).map((s, idx) => ({
      ...s,
      image: s.image_url || s.image,
      title: s.title,
      addr1: s.addr1 || s.sido_name || '',
      addr2: s.addr2 || s.gungu_name || '',
      likeCount: s.like_cnt ?? s.likeCount ?? 0,
      _key: `${s.attraction_id || idx}-${idx}`,
    }))
  } catch (e) {
    console.error('관광지 로딩 오류:', e)
    spots.value = []
  }
}

const displaySpots = computed(() => {
  const list = spots.value || []
  if (!list.length) return []
  const minCards = 8
  const repeats = Math.max(2, Math.ceil(minCards / list.length))
  const merged = Array.from({ length: repeats }, () => list).flat()
  return merged.map((s, idx) => ({ ...s, _key: `${s.attraction_id || idx}-${idx}` }))
})

const measure = () => {
  const track = trackRef.value
  if (!track) {
    halfWidth.value = 0
    return
  }
  halfWidth.value = track.scrollWidth / 2
}

const step = () => {
  if (!displaySpots.value.length) return
  if (!halfWidth.value) return

  offset.value -= speed
  if (Math.abs(offset.value) >= halfWidth.value) {
    offset.value += halfWidth.value
  }

  rafId = requestAnimationFrame(step)
}

const start = () => {
  stop()
  measure()
  if (!halfWidth.value) return
  rafId = requestAnimationFrame(step)
}

const stop = () => {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
}

const pause = () => stop()
const resume = () => {
  if (!rafId) start()
}

onMounted(async () => {
  await load()
  await nextTick()
  start()
})

watch(displaySpots, async () => {
  await nextTick()
  offset.value = 0
  start()
})

onBeforeUnmount(() => stop())

const trackStyle = computed(() => ({
  transform: `translateX(${offset.value}px)`,
}))
</script>

<style lang="scss" scoped>
.carousel {
  width: 100%;

  margin: 0 auto;
}

.viewport {
  border-radius: 18px;
  overflow: hidden;
  background: rgba(17, 24, 39, 0.35);
  backdrop-filter: blur(14px);
  padding: 8px 4px;
}

.track {
  display: inline-flex;
  gap: 14px;
  padding: 4px;
  will-change: transform;
}

.card {
  position: relative;
  min-width: 260px;
  height: 240px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.2), transparent);
}

.prompt {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 16px;
}

.prompt__label {
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.prompt__desc {
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

.like-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
}

.like-icon {
  font-size: 12px;
  line-height: 1;
}

.like-count {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.2px;
}

.meta {
  position: absolute;
  left: 14px;
  bottom: 12px;
  right: 14px;
  color: white;
}

.title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.2px;
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.addr {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
}
</style>
