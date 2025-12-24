<template>
  <aside class="sidebar">
    <div class="inner">
      <section v-if="tripDetail" class="trip-header">
        <div class="sidebar-header">
          <div class="sidebar-header-wrapper">
            <div class="subtitle">{{ tripDetail.sido_name }} {{ tripDetail.gungu_name }} 여행</div>
            <h1 class="title">{{ tripDetail.title }}</h1>

            <div class="date-row">
              <span>{{ tripDetail.start_date }} - {{ tripDetail.end_date }}</span>
            </div>
          </div>
        </div>

        <div class="host-box">
          <div class="host-desc">{{ tripDetail.description }}</div>
        </div>

        <div class="image-box">
          <img :src="tripDetail.image_url" alt="여행지 사진" />
        </div>

        <div class="participants">
          <div class="label">호스트</div>
          <div class="avatars">
            <div v-if="host" class="avatar" :title="host.nickname">
              <img v-if="host.profile_image" :src="host.profile_image" class="avatar-img" />
              <span v-else>{{ host.nickname.slice(0, 1) }}</span>
            </div>
          </div>
        </div>

        <div class="participants">
          <div class="label">참여자</div>
          <div class="avatars">
            <div v-for="g in guests" :key="g.member_id" class="avatar" :title="g.nickname">
              <img v-if="g.profile_image" :src="g.profile_image" class="avatar-img" />
              <span v-else>{{ g.nickname.slice(0, 1) }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="day-tabs" v-if="dayNumbers.length">
        <button
          v-for="day in dayNumbers"
          :key="day"
          class="day-btn"
          :class="{ 'day-btn--active': activeDay === day }"
          @click="activeDay = day"
        >
          Day {{ day }}
        </button>
      </section>

      <section class="places">
        <div v-if="itineraryLoading" class="empty">일정 불러오는 중...</div>
        <div v-else-if="itineraryError" class="empty">{{ itineraryError }}</div>
        <div v-else-if="!activePlaces.length" class="empty">등록된 일정이 없습니다.</div>

        <div
          v-else
          v-for="(place, index) in activePlaces"
          :key="place.itinerary_id"
          class="place"
          :class="[
            selStore.selectedItineraryId === place.itinerary_id
              ? 'place--selected'
              : 'place--normal',
          ]"
          @click="onClickPlace(place)"
          draggable="true"
          @dragstart="onDragStart(place.itinerary_id, index)"
          @dragend="onDragEnd"
          @drop.prevent="onDrop(index)"
        >
          <div class="handle">⋮⋮</div>

          <div class="num" :class="{ 'num--highlight': index === 0 }">{{ index + 1 }}</div>

          <div class="info">
            <div class="name">{{ place.attraction_title }}</div>
            <div class="category">{{ place.cat3 }}</div>
          </div>

          <div class="meta">
            <span>{{ place.start_time }} - {{ place.end_time }}</span>
          </div>
        </div>
      </section>
      <div class="sidebar-footer">
        <button class="add-btn" type="button" @click="openAddSheet">+ 장소 추가</button>
      </div>
      <div
        class="sheet-overlay"
        :class="{ 'sheet-overlay--open': isAddOpen }"
        @click.self="closeAddSheet"
      >
        <div
          class="sheet"
          :class="{ 'sheet--open': isAddOpen }"
          :style="{ height: sheetHeight }"
          @click.stop
        >
          <div class="sheet-grabber" />
          <div class="sheet-header">
            <div class="sheet-title">장소 추가</div>
            <button class="sheet-close" type="button" @click="closeAddSheet">닫기</button>
          </div>

          <div class="sheet-body">
            <!-- ✅ 여기에 나중에 분리한 컴포넌트 끼우기 -->
            <!-- <PlaceAddPanel :trip-id="props.tripId" :day="activeDay" @done="closeAddSheet" /> -->
            <div class="sheet-placeholder">(PlaceAddPanel 컴포넌트 자리)</div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, watch, onBeforeUnmount, ref } from 'vue'
import { getItinerariesMock } from '@/api/tripApi'
import { useTripSelectionStore } from '@/stores/tripSelection'
const selStore = useTripSelectionStore()

const onClickPlace = (place) => {
  selStore.select(place, 'sidebar')
}

const props = defineProps({
  tripId: { type: Number, required: true },
  tripDetail: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  errorMsg: { type: String, default: '' },
})

const emit = defineEmits(['itineraries:loaded'])

const isAddOpen = ref(false)

const sheetHeight = computed(() => '78%')

const openAddSheet = () => {
  isAddOpen.value = true
}

const closeAddSheet = () => {
  isAddOpen.value = false
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && isAddOpen.value) closeAddSheet()
}
window.addEventListener('keydown', onKeydown)

const host = computed(() => props.tripDetail?.trip_members?.find((m) => m.role === 'HOST') ?? null)
const guests = computed(
  () => props.tripDetail?.trip_members?.filter((m) => m.role !== 'HOST') ?? [],
)
const dayNumbers = computed(() => props.tripDetail?.day_numbers ?? [])

const activeDay = ref(null)
const itineraries = ref([])
const itineraryLoading = ref(false)
const itineraryError = ref('')

const fetchItineraries = async () => {
  const tripId = props.tripDetail?.trip_id
  const day = activeDay.value
  if (!tripId || !day) return

  itineraryLoading.value = true
  itineraryError.value = ''

  try {
    const res = await getItinerariesMock({ trip_id: tripId, day_number: day })
    if (!res.success) throw new Error(res.error?.message ?? 'itinerary fetch fail')
    itineraries.value = res.data ?? []

    emit('itineraries:loaded', {
      day,
      places: activePlaces.value,
    })
  } catch (e) {
    itineraries.value = []
    itineraryError.value = e?.message ?? '일정 조회 실패'

    emit('itineraries:loaded', { day, places: [] })
  } finally {
    itineraryLoading.value = false
  }
}

watch(
  () => props.tripDetail,
  (v) => {
    if (!v) return
    activeDay.value = v.day_numbers?.[0] ?? 1
    fetchItineraries()
  },
  { immediate: true },
)

watch(activeDay, () => {
  fetchItineraries()
})

const activePlaces = computed(() => {
  return [...itineraries.value].sort((a, b) => a.visit_order - b.visit_order)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

const draggedId = ref(null)
const dragFromIndex = ref(-1)

const onDragStart = (id, index) => {
  draggedId.value = id
  dragFromIndex.value = index
}

const onDrop = async (toIndex) => {
  const from = dragFromIndex.value
  if (from === -1 || toIndex === -1 || from === toIndex) return

  const copied = [...activePlaces.value]
  const moved = copied.splice(from, 1)[0]
  copied.splice(toIndex, 0, moved)

  itineraries.value = copied.map((p, idx) => ({ ...p, visit_order: idx + 1 }))
  dragFromIndex.value = toIndex

  console.log('[Trip] Place order updated → send API request', {
    tripId: props.tripDetail?.trip_id,
    day: activeDay.value,
    orderedIds: itineraries.value.map((p) => p.itinerary_id),
  })
}

const onDragEnd = () => {
  draggedId.value = null
  dragFromIndex.value = -1
}
</script>

<style lang="scss" scoped>
.sheet-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease;

  /* 오버레이 배경(원하면 더 진하게) */
  background: rgba(0, 0, 0, 0.22);

  &--open {
    pointer-events: auto;
    opacity: 1;
  }
}

.place--normal {
  background: rgba(255, 255, 255, 0.06);

  &:hover {
    background: rgba(255, 255, 255, 0.09);
  }
}

.place--selected {
  border: 2px solid rgba(70, 160, 255, 0.9);
  background: rgba(70, 160, 255, 0.1);
}

.sheet {
  position: absolute;
  left: 0;
  right: 0;

  bottom: 0;

  border-top-left-radius: 18px;
  border-top-right-radius: 18px;

  background: rgba(20, 24, 40, 0.96);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  transform: translateY(102%);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);

  display: flex;
  flex-direction: column;
  min-height: 0;

  &--open {
    transform: translateY(0);
  }
}

.sheet-grabber {
  width: 42px;
  height: 4px;
  border-radius: 999px;
  margin: 10px auto 8px;
  background: rgba(255, 255, 255, 0.28);
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .sheet-title {
    font-weight: 900;
    font-size: 14px;
    opacity: 0.95;
  }

  .sheet-close {
    border: 0;
    background: rgba(255, 255, 255, 0.08);
    color: white;
    padding: 8px 10px;
    border-radius: 10px;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.14);
    }
  }
}

.sheet-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px;
}

.sheet-placeholder {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  opacity: 0.85;
  font-size: 13px;
}
.sidebar {
  width: 100%;
  height: 100%;
  flex-shrink: 0;

  overflow: hidden;

  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);

  position: relative;
}

.inner {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 24px;

  overflow: hidden;

  min-height: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
}

.trip-header {
  margin-bottom: 18px;
}

.subtitle {
  margin-bottom: 6px;
  font-size: 12px;
  opacity: 0.7;
}

.title {
  margin: 0 0 10px;
  font-size: 22px;
  font-weight: 800;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.75;
  margin-bottom: 14px;
}

.participants {
  margin-bottom: 14px;

  .label {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 700;
  }

  .avatars {
    display: flex;
    gap: 8px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.1);

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.host-box {
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
  margin-bottom: 14px;

  .host-desc {
    font-size: 12px;
    opacity: 0.75;
    line-height: 1.35;
  }
}

.image-box {
  max-width: 100%;
  margin-bottom: 14px;
}

.image-box img {
  display: block; // ⭐ 핵심
  width: 100%; // ⭐ 핵심
  height: auto;
  object-fit: cover;
}

.day-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 10px;

  .day-btn {
    border: 0;
    cursor: pointer;
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    background: rgba(255, 255, 255, 0.08);

    &--active {
      color: white;
      font-size: 13px;
      font-weight: 700;
      background: rgba(70, 160, 255, 0.35);
      box-shadow: 0 10px 25px rgba(70, 160, 255, 0.15);
    }
  }
}

.places {
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* ✅ 핵심 */
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  /* (선택) 스크롤 영역 상/하 여백 느낌 */
  padding-right: 6px;
}

.empty {
  padding: 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  opacity: 0.85;
  font-size: 13px;
}

.place {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  padding: 20px;
  user-select: none;
  cursor: pointer;

  &--normal {
    border: 2px solid transparent;
    background: rgba(255, 255, 255, 0.06);

    &:hover {
      background: rgba(255, 255, 255, 0.09);
    }
  }

  &--highlight {
    border: 2px solid rgba(70, 160, 255, 0.9);
    background: rgba(70, 160, 255, 0.1);
  }

  &--dragging {
    opacity: 0.5;
  }
}

.handle {
  width: 18px;
  text-align: center;
  opacity: 0.6;
  cursor: grab;
}

.num {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 900;
  background: rgba(155, 100, 255, 0.35);

  &--highlight {
    background: rgba(70, 160, 255, 0.9);
  }
}

.info {
  flex: 1;
  min-width: 0;

  .name {
    font-weight: 800;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 4px;
  }
}

.meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 13px;
  opacity: 0.7;
}

.sidebar-footer {
  /* ✅ 고정 영역 */
  flex-shrink: 0;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 12px;
}

/* ✅ 버튼 스타일(원하는대로 수정 가능) */
.add-btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  font-weight: 800;
  color: #0b0f1a;
  background: rgba(255, 255, 255, 0.92);

  &:hover {
    background: #1f6feb;
    color: white;

    transition:
      background 0.3s ease,
      color 0.3s ease;
  }
}
</style>
