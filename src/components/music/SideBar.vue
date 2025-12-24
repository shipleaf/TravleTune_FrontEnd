<template>
  <aside class="sidebar">
    <div class="sidebar-inner">
      <!-- 검색 영역 -->
      <div class="sidebar-search">
        <div class="sidebar-search-input-wrapper">
          <input
            v-model="keyword"
            type="text"
            class="sidebar-search-input"
            placeholder="떠나고 싶은 관광지를 입력해 주세요"
          />
          <button class="setting-btn" type="button" @click="openRegionModal">
            <span class="bar bar1"></span>
            <span class="bar bar2"></span>
            <span class="bar bar1"></span>
          </button>
        </div>
      </div>

      <!-- 검색 결과 리스트 -->
      <div class="sidebar-list">
        <SpotCard
          v-for="spot in mockSpots"
          :key="spot.attraction_id"
          :spot="spot"
          @click="handleSelectSpot(spot)"
        />
      </div>
    </div>
  </aside>

  <Teleport to="body">
    <div v-if="showRegionModal" class="region-overlay" @click.self="closeRegionModal">
      <SiGunguSelectForm @close="closeRegionModal" />
    </div>
  </Teleport>
</template>

<script setup>
import { fetchDetailCommon2, extractDetailCommon2 } from '@/api/attractions'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SpotCard from './SpotCard.vue'
import SiGunguSelectForm from './SiGunguSelectForm.vue'
import { useSpotStore } from '@/stores/spot'
import { fetchSpots } from '@/api/attractions'

const mapWithConcurrency = async (arr, limit, mapper) => {
  const result = new Array(arr.length)
  let idx = 0

  const workers = Array.from({ length: limit }).map(async () => {
    while (idx < arr.length) {
      const cur = idx++
      result[cur] = await mapper(arr[cur], cur)
    }
  })

  await Promise.all(workers)
  return result
}

const store = useSpotStore()

const { setSelectedSpot } = store

const keyword = ref('')

const mockSpots = ref([])

// 🔹 모달 열림 상태
const showRegionModal = ref(false)

const openRegionModal = () => {
  showRegionModal.value = true
}

const closeRegionModal = () => {
  showRegionModal.value = false
}

// 🔹 ESC 키로 닫기
const handleKeydown = (e) => {
  if (e.key === 'Escape' && showRegionModal.value) {
    closeRegionModal()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)

  try {
    const response = await fetchSpots()
    const baseSpots = response.data.data.attractions ?? []

    // ✅ contentId 기준으로 TourAPI 상세조회 후 병합
    const merged = await mapWithConcurrency(baseSpots, 5, async (spot) => {
      // contentId가 없다면 그대로 반환
      if (!spot.contentId) {
        console.log('id 없음')
        return spot
      }
      try {
        const detailRes = await fetchDetailCommon2(spot.contentId)
        const detail = extractDetailCommon2(detailRes)

        return {
          ...spot,
          addr1: detail.addr1 || spot.addr1,
          addr2: detail.addr2 || spot.addr2,
          description: detail.description || spot.description,
        }
      } catch (e) {
        // ✅ 상세 실패해도 리스트는 뜨게
        return spot
      }
    })

    mockSpots.value = merged
    console.log(mockSpots.value)
  } catch {
    return
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

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

.sidebar-search-button {
  width: 100%;
  border-radius: 12px;
  border: none;
  padding: 10px 14px;
  background: var(--sidebar-primary);
  color: var(--sidebar-primary-foreground);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(56, 189, 248, 0.3);
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.sidebar-search-button:hover {
  background: color-mix(in oklch, var(--sidebar-primary) 90%, white 10%);
  box-shadow: 0 12px 30px rgba(56, 189, 248, 0.4);
  transform: translateY(-1px);
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 6px;
  display: flex;
  flex-direction: column;
}

/* 시군구 토글 버튼 */
.setting-btn {
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

/* 🔹 전체 화면 오버레이 */
.region-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>
