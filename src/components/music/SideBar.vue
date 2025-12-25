<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <div class="sidebar-search">
        <div class="sidebar-search-input-wrapper">
          <input
            v-model="keyword"
            type="text"
            class="sidebar-search-input"
            placeholder="가보고 싶은 관광지를 입력해주세요"
          />
          <button ref="filterButtonRef" class="setting-btn" type="button" @click="openRegionModal">
            <span class="bar bar1"></span>
            <span class="bar bar2"></span>
            <span class="bar bar1"></span>
          </button>
          <Teleport to="body">
            <div
              v-if="showRegionModal"
              class="region-overlay"
              :style="regionModalStyle"
              @click.self="closeRegionModal"
            >
              <SiGunguSelectForm @close="closeRegionModal" @apply="handleApplyFilters" />
            </div>
          </Teleport>
        </div>
      </div>

      <div class="sidebar-list" ref="listRef" @scroll="handleListScroll">
        <SpotCard
          v-for="spot in mockSpots"
          :key="spot.attraction_id"
          :spot="spot"
          @click="handleSelectSpot(spot)"
        />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
import SpotCard from './SpotCard.vue'
import SiGunguSelectForm from './SiGunguSelectForm.vue'
import { useSpotStore } from '@/stores/spot'
import { useFilterStore } from '@/stores/filter'
import { fetchSpots } from '@/api/attractions'
import { storeToRefs } from 'pinia'

const store = useSpotStore()
const filterStore = useFilterStore()

const { setSelectedSpot, setSpots } = store
const { keyword, sido_code, gungu_code, content_type } = storeToRefs(filterStore)

const mockSpots = ref([])
const cursor = ref(null)
const hasNext = ref(true)
const isLoading = ref(false)
const listRef = ref(null)
let keywordTimer = null

const showRegionModal = ref(false)
const filterButtonRef = ref(null)
const modalPosition = ref({ top: 0, left: 0 })

const updateModalPosition = () => {
  if (!filterButtonRef.value) return

  const rect = filterButtonRef.value.getBoundingClientRect()
  modalPosition.value = {
    top: rect.top + window.scrollY,
    left: rect.right + 8 + window.scrollX,
  }
}

const regionModalStyle = computed(() => ({
  top: `${modalPosition.value.top}px`,
  left: `${modalPosition.value.left}px`,
}))

const openRegionModal = async () => {
  await nextTick()
  updateModalPosition()
  showRegionModal.value = true
}

const closeRegionModal = () => {
  showRegionModal.value = false
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showRegionModal.value) {
    closeRegionModal()
  }
}

const handleWindowChange = () => {
  if (showRegionModal.value) {
    updateModalPosition()
  }
}

const buildFilterParams = (extra = {}) => {
  const params = { size: 10, ...extra }

  if (sido_code.value) params.sidoCode = sido_code.value
  if (gungu_code.value) params.gunguCode = gungu_code.value
  if (content_type.value && content_type.value !== 'all') params.contentType = content_type.value
  if (keyword.value && keyword.value.trim()) params.title = keyword.value.trim()

  return params
}

const fetchAndSetSpots = async ({ reset = false } = {}) => {
  if (isLoading.value) return
  if (!hasNext.value && !reset) return

  isLoading.value = true

  if (reset) {
    cursor.value = null
    hasNext.value = true
    mockSpots.value = []
  }

  try {
    const response = await fetchSpots(buildFilterParams({ cursor: cursor.value }))
    const data = response?.data?.data ?? {}
    const attractions = data.attractions ?? []

    mockSpots.value = reset ? attractions : [...mockSpots.value, ...attractions]
    setSpots(mockSpots.value)
    cursor.value = data.next_cursor ?? null
    hasNext.value = Boolean(data.has_next)
  } catch (e) {
    hasNext.value = false
  } finally {
    isLoading.value = false
  }
}

const handleApplyFilters = () => {
  closeRegionModal()
  fetchAndSetSpots({ reset: true })
}

const handleKeywordChange = () => {
  if (keywordTimer) clearTimeout(keywordTimer)
  keywordTimer = setTimeout(() => {
    fetchAndSetSpots({ reset: true })
  }, 400)
}

const handleListScroll = () => {
  const el = listRef.value
  if (!el || isLoading.value || !hasNext.value) return

  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50
  if (nearBottom) {
    fetchAndSetSpots()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleWindowChange)
  window.addEventListener('scroll', handleWindowChange, true)

  fetchAndSetSpots({ reset: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleWindowChange)
  window.removeEventListener('scroll', handleWindowChange, true)
  filterStore.$reset()
  if (keywordTimer) clearTimeout(keywordTimer)
})

watch(keyword, handleKeywordChange)

const handleSelectSpot = (spot) => {
  setSelectedSpot(spot)
}
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 30%;
  min-width: 500px;
  height: 70%;
  overflow-y: auto;
  overflow-x: visible;
  background: color-mix(in oklch, var(--sidebar) 80%, transparent);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.sidebar-inner {
  overflow-x: visible;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
}

.sidebar-search {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-search-input-wrapper {
  position: relative;
  display: flex;
  gap: 12px;
}

.sidebar-search-input {
  display: flex;
  flex: 1;
  border-radius: 12px;
  border: 1px solid var(--input);
  padding: 14px;
  background: color-mix(in oklch, var(--background) 60%, transparent);
  color: var(--foreground);
  font-size: 14px;

  &:focus {
    outline: none;
  }
}

.sidebar-search-input::placeholder {
  color: var(--muted-foreground);
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
}

.setting-btn {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border-radius: 10px;
  cursor: pointer;
  border: none;
}
.bar {
  width: 50%;
  height: 2px;
  background-color: rgb(229, 229, 229);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 2px;
}
.bar::before {
  content: '';
  width: 2px;
  height: 2px;
  background-color: rgb(126, 117, 255);
  position: absolute;
  border-radius: 50%;
  border: 2px solid white;
  transition: all 0.3s;
  box-shadow: 0px 0px 5px white;
}
.bar1::before {
  transform: translateX(-4px);
}
.bar2::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar1::before {
  transform: translateX(4px);
}
.setting-btn:hover .bar2::before {
  transform: translateX(-4px);
}

.region-overlay {
  position: fixed;
  z-index: 1000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  border-radius: 12px;
}
</style>
