<template>
  <aside class="sidebar">
    <div class="inner">
      <!-- Trip Header -->
      <section class="trip-header">
        <div class="subtitle">오사카 여행</div>
        <h1 class="title">오사카 여행</h1>

        <div class="date-row">
          <span>2024.02.20 - 2024.02.24</span>
        </div>

        <div class="host-box">
          <div class="host-desc">
            친구들과 함께하는 오사카 여행 일정입니다. 맛집과 관광지를 중심으로 계획했습니다.
          </div>
        </div>

        <div class="participants">
          <div class="label">호스트</div>
          <div class="avatars">
            <div class="avatar">선</div>
          </div>
        </div>
        <div class="participants">
          <div class="label">참여자</div>
          <div class="avatars">
            <div v-for="p in participants" :key="p.id" class="avatar" :title="p.name">
              <img v-if="p.avatar" :src="p.avatar" alt="avatar" class="avatar-img" />
              <!-- <div v-if=""></div> -->
            </div>
          </div>
        </div>
      </section>

      <section class="day-tabs">
        <button
          v-for="day in itinerary"
          :key="day.day"
          class="day-btn"
          :class="{ 'day-btn--active': activeDay === day.day }"
          @click="activeDay = day.day"
        >
          day{{ day.day }}
        </button>
      </section>

      <section class="places" @mouseenter="isOverList = true" @mouseleave="handleListLeave">
        <div
          v-for="(place, index) in activePlaces"
          :key="place.id"
          class="place"
          :class="[
            index === 0 ? 'place--highlight' : 'place--normal',
            draggedId === place.id ? 'place--dragging' : '',
          ]"
          draggable="true"
          @dragstart="onDragStart(place.id, index)"
          @dragend="onDragEnd"
          @dragover.prevent="onDragOver(index)"
          @drop.prevent="onDrop(index)"
          @mouseenter="handlePlaceHover(place, $event)"
        >
          <!-- Drag Handle -->
          <div class="handle" title="드래그로 순서 변경">⋮⋮</div>

          <!-- Place Number -->
          <div class="num" :class="{ 'num--highlight': index === 0 }">
            {{ index + 1 }}
          </div>

          <!-- Place Info -->
          <div class="info">
            <div class="name">{{ place.name }}</div>
            <div class="category">{{ place.category }}</div>
          </div>

          <!-- Time and Distance -->
          <div class="meta">
            <span v-if="place.time">{{ place.time }}</span>
            <span v-if="place.distance">{{ place.distance }}</span>
          </div>
        </div>
      </section>
    </div>
  </aside>

  <!-- Hover Modal -->
  <PlaceDetailModal
    v-if="hoveredPlace"
    :place="hoveredPlace"
    :position="hoverPosition"
    @close="handleModalClose"
    @mouseenter="handleModalEnter"
    @mouseleave="handleModalLeave"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import PlaceDetailModal from './PlaceDetailModal.vue'

const itinerary = ref([
  {
    day: 1,
    date: '2.20/화',
    places: [
      {
        id: '1',
        name: '산정시립박스터미널',
        category: '나만의 장소',
        distance: '31.5km',
        time: '08:30',
      },
      {
        id: '2',
        name: '건주시립박스터미널',
        category: '나만의 장소',
        distance: '78km',
        time: '09:22',
      },
      { id: '3', name: '김해국제공항', category: '나만의 장소', distance: '', time: '' },
      {
        id: '4',
        name: 'PUS 14:05 - KIX 15:20',
        category: '진에어 - LJ255',
        distance: '580km',
        time: '14:05',
      },
      {
        id: '5',
        name: '간사이 국제공항',
        category: '공항포트 - 에어커피',
        distance: '36.3km',
        time: '',
      },
      {
        id: '6',
        name: '아키나쿠 마루 본점',
        category: '맛상점 - 나베',
        distance: '406m',
        time: '',
      },
    ],
  },
])

const participants = ref([
  { id: '1', name: '친구1', initials: '친구1', avatar: '/src/assets/img/shipleaf.jpg' },
  {
    id: '2',
    name: 'SNS 친구베이스 외 2',
    initials: 'SNS',
    avatar: '/src/assets/img/shipleaf.jpg',
  },
])

const activeDay = ref(1)

/** ✅ hover modal 상태 */
const hoveredPlace = ref(null)
const hoverPosition = reactive({ x: 0, y: 0 })

const isOverList = ref(false)
const isOverModal = ref(false)
let closeTimeout = null

const clearCloseTimeout = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
}

const handlePlaceHover = (place, e) => {
  clearCloseTimeout()
  isOverList.value = true
  hoveredPlace.value = place
  hoverPosition.x = e.clientX
  hoverPosition.y = e.clientY
}

const handleListLeave = () => {
  isOverList.value = false
  clearCloseTimeout()
  closeTimeout = setTimeout(() => {
    if (!isOverList.value && !isOverModal.value) hoveredPlace.value = null
  }, 100)
}

const handleModalEnter = () => {
  clearCloseTimeout()
  isOverModal.value = true
}

const handleModalLeave = () => {
  isOverModal.value = false
  clearCloseTimeout()
  closeTimeout = setTimeout(() => {
    if (!isOverList.value && !isOverModal.value) hoveredPlace.value = null
  }, 100)
}

const handleModalClose = () => {
  isOverList.value = false
  isOverModal.value = false
  clearCloseTimeout()
  hoveredPlace.value = null
}

onBeforeUnmount(() => clearCloseTimeout())

/** ✅ 현재 day places */
const activePlaces = computed(() => {
  const day = itinerary.value.find((d) => d.day === activeDay.value)
  return day ? day.places : []
})

/** ✅ drag & drop reorder (실제 순서 변경) */
const draggedId = ref(null)
const dragFromIndex = ref(-1)
const dragOverIndex = ref(-1)

const onDragStart = (id, index) => {
  draggedId.value = id
  dragFromIndex.value = index
}

const onDragOver = (index) => {
  dragOverIndex.value = index
}

const onDrop = async (toIndex) => {
  const from = dragFromIndex.value
  if (from === -1 || toIndex === -1 || from === toIndex) return

  const dayIdx = itinerary.value.findIndex((d) => d.day === activeDay.value)
  if (dayIdx === -1) return

  const places = itinerary.value[dayIdx].places
  const moved = places.splice(from, 1)[0]
  places.splice(toIndex, 0, moved)

  // drag index 리셋
  dragFromIndex.value = toIndex

  // ✅ 드랍 즉시 API 요청 (자리만)
  console.log('[Trip] Place order updated → send API request', {
    day: activeDay.value,
    orderedIds: places.map((p) => p.id),
  })
}

const onDragEnd = () => {
  draggedId.value = null
  dragFromIndex.value = -1
  dragOverIndex.value = -1
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 380px;
  height: 100%;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.inner {
  padding: 24px;
  min-height: 200%;
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

  .host-label {
    font-size: 11px;
    font-weight: 800;
    margin-bottom: 6px;
  }
  .host-name {
    font-size: 13px;
    opacity: 0.8;
    margin-bottom: 8px;
  }
  .host-desc {
    font-size: 12px;
    opacity: 0.75;
    line-height: 1.35;
  }
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
      background: rgba(70, 160, 255, 0.35);
      box-shadow: 0 10px 25px rgba(70, 160, 255, 0.15);
    }
  }
}

.places {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.place {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
  padding: 12px;
  user-select: none;

  &--normal {
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
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .category {
    font-size: 11px;
    opacity: 0.7;
    margin-top: 4px;
  }
}

.meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  font-size: 11px;
  opacity: 0.7;
}
</style>
