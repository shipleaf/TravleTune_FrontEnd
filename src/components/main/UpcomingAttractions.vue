<template>
  <section class="component">
    <div class="title-row">
      <label class="component-title">다가오는 여행</label>
      <span class="component-badge" v-if="!isLoading">{{ upcomingTrips.length }}</span>
    </div>

    <span v-if="!isLoading && upcomingTrips.length === 0" class="prompt__desc">
      아직 다가오는 여행이 없어요. ‘여행 만들기’로 새로운 여행을 추가해 보세요!
    </span>

    <div v-if="isLoading" class="skeleton-list">
      <div class="skeleton-card" v-for="n in 2" :key="n" />
    </div>

    <div v-else class="trip-list">
      <article v-for="t in upcomingTrips" :key="t.trip_id" class="trip-card">
        <div class="thumb">
          <img :src="t.image_url || fallbackImage" alt="trip" />
          <div class="thumb-grad" />
        </div>

        <div class="card-body">
          <div class="card-top">
            <div class="place">
              {{ t.sido_name }} <span v-if="t.gungu_name">· {{ t.gungu_name }}</span>
            </div>
            <div class="date">{{ formatDate(t.start_date) }} ~ {{ formatDate(t.end_date) }}</div>
          </div>

          <div class="title">{{ t.title }}</div>

          <div class="members">
            <div class="avatars">
              <img
                v-for="(m, idx) in t.trip_members.slice(0, 4)"
                :key="m.member_id"
                class="avatar"
                :style="{ zIndex: 10 - idx }"
                :src="m.profile_image"
                :alt="m.nickname"
                :title="m.nickname"
              />
              <div v-if="t.trip_members.length > 4" class="more">
                +{{ t.trip_members.length - 4 }}
              </div>
            </div>

            <div class="host">
              <span class="host-dot" />
              HOST: {{ getHostName(t.trip_members) }}
            </div>
          </div>
        </div>
      </article>
    </div>

    <span v-if="errorMsg" class="error">{{ errorMsg }}</span>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTripsMock } from '@/api/tripApi'
import { getTripImageMock } from '@/api/tripApi'

const upcomingTrips = ref([])
const isLoading = ref(false)
const errorMsg = ref('')

const fallbackImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'

const toISODate = (d = new Date()) => {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const formatDate = (iso) => {
  if (!iso) return ''
  const [, m, d] = iso.split('-')
  return `${m}.${d}`
}

const getHostName = (members = []) => {
  const host = members.find((m) => m.role === 'HOST')
  return host?.nickname ?? members[0]?.nickname ?? ''
}

const loadUpcomingTrips = async () => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    const todayISO = toISODate()

    const res = await getTripsMock()
    if (!res?.success) {
      errorMsg.value = res?.error?.message ?? '여행 목록을 불러오지 못했어요.'
      upcomingTrips.value = []
      return
    }

    const upcoming = (res.data ?? [])
      .filter((t) => t.start_date >= todayISO)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))

    const withImages = await Promise.all(
      upcoming.map(async (t) => {
        try {
          const imgRes = await getTripImageMock(t.trip_id)
          return { ...t, image_url: imgRes?.data?.image_url ?? null }
        } catch {
          return { ...t, image_url: null }
        }
      }),
    )

    upcomingTrips.value = withImages
  } catch (e) {
    console.error(e)
    errorMsg.value = '네트워크 오류가 발생했어요.'
    upcomingTrips.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUpcomingTrips()
})
</script>

<style lang="scss" scoped>
.component {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.component-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
}

.component-badge {
  min-width: 26px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.prompt__desc {
  font-size: 12px;
  line-height: 1.4;
  color: rgba(244, 244, 245, 0.55);
  margin-top: 2px;
  display: inline-block;
}

.trip-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trip-card {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.18);
  }
}

.thumb {
  position: relative;
  width: 120px;
  height: 120px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.thumb-grad {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
}

.card-body {
  padding: 12px 12px 12px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.place {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
}

.date {
  font-size: 12px;
  color: rgba(244, 244, 245, 0.55);
  white-space: nowrap;
}

.title {
  font-size: 16px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.members {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.avatars {
  display: flex;
  align-items: center;
}

.avatar {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid rgba(0, 0, 0, 0.35);
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
}

.more {
  margin-left: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 3px 8px;
  font-weight: 700;
}

.host {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(244, 244, 245, 0.65);
  white-space: nowrap;
}

.host-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
}

.error {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 120, 120, 0.9);
}

/* ✅ 로딩 스켈레톤 */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 120px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;
}

.skeleton-card::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  animation: shimmer 1.15s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-60%);
  }
  100% {
    transform: translateX(60%);
  }
}
</style>
