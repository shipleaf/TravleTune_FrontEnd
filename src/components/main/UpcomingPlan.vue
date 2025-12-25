<template>
  <div class="carousel" @mouseenter="pause" @mouseleave="resume">
    <div class="viewport">
      <div v-if="hasTrips" class="track" :style="trackStyle">
        <article v-for="trip in trips" :key="trip.trip_id || trip.title" class="card">
          <img class="img" :src="trip.image_url || defaultImage" :alt="trip.title" />
          <div class="overlay"></div>

          <div class="meta">
            <h3 class="title">{{ trip.title }}</h3>
            <p class="addr">
              {{ trip.sido_name }} {{ trip.gungu_name }} ·
              {{ formatDate(trip.start_date) }} ~ {{ formatDate(trip.end_date) }}
            </p>
          </div>
        </article>
      </div>

      <div v-else class="empty-card">
        <p class="empty-text">아직 여행 일정이 없어요</p>
      </div>
    </div>

    <div v-if="hasTrips" class="dots">
      <button
        v-for="(_, i) in trips.length"
        :key="i"
        class="dot"
        :class="{ active: i === index }"
        type="button"
        @click="go(i)"
        aria-label="go slide"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { getTrips } from '@/api/tripApi'

const trips = ref([])
const index = ref(0)
const defaultImage =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=60'

const intervalMs = 2500
let timer = null

const load = async () => {
  try {
    const res = await getTrips()
    const payload = res?.data?.data ?? res?.data ?? res
    trips.value = Array.isArray(payload) ? payload : []
  } catch (e) {
    console.error('여행 일정 로딩 오류:', e)
    trips.value = []
  }
}

const next = () => {
  if (!trips.value.length) return
  index.value = (index.value + 1) % trips.value.length
}

const go = (i) => {
  index.value = i
}

const start = () => {
  stop()
  if (!trips.value.length) return
  timer = window.setInterval(next, intervalMs)
}

const stop = () => {
  if (timer) window.clearInterval(timer)
  timer = null
}

const pause = () => stop()
const resume = () => start()

onMounted(async () => {
  await load()
  start()
})

onBeforeUnmount(() => stop())

const trackStyle = computed(() => ({
  transform: `translateX(-${index.value * 100}%)`,
}))

const hasTrips = computed(() => trips.value.length > 0)

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const m = `${d.getMonth() + 1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
</script>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.viewport {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(17, 24, 39, 0.4);
  backdrop-filter: blur(14px);
}

.track {
  display: flex;
  width: 100%;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.card {
  position: relative;
  min-width: 100%;
  height: 340px;
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
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.15), transparent);
}

.meta {
  position: absolute;
  left: 18px;
  bottom: 16px;
  right: 18px;
  color: white;
}

.title {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.2px;
  text-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
}

.addr {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.dots {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 12px;
}

.dot {
  height: 8px;
  width: 8px;
  border-radius: 999px;
  border: none;
  cursor: pointer;

  background: rgba(255, 255, 255, 0.35);

  transition:
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.25s ease,
    opacity 0.25s ease;
}

.dot.active {
  width: 28px;
  background: rgba(255, 255, 255, 0.95);
}

.empty-card {
  min-height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 700;
  font-size: 18px;
  background: rgba(17, 24, 39, 0.4);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.empty-text {
  margin: 0;
}
</style>
