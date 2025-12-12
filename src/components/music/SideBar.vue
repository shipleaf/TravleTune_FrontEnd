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
            placeholder="떠나고 싶은 관광지를 입력해 주세요!"
          />
          <button class="setting-btn" type="button" @click="openRegionModal">
            <span class="bar bar1"></span>
            <span class="bar bar2"></span>
            <span class="bar bar1"></span>
          </button>
        </div>
        <button type="button" class="sidebar-search-button">Search</button>
      </div>

      <!-- 검색 결과 리스트 -->
      <div class="sidebar-list">
        <SpotCard
          v-for="spot in filteredSpots"
          :key="spot.id"
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
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import SpotCard from './SpotCard.vue'
import SiGunguSelectForm from './SiGunguSelectForm.vue'
import { useSpotStore } from '@/stores/spot'

const store = useSpotStore()
const { setSelectedSpot } = store

defineProps({
  selectedSpot: Object,
})

const keyword = ref('')

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

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const mockSpots = ref([
  {
    id: 1,
    name: 'Santorini, Greece',
    description: 'Stunning sunsets and Mediterranean vibes',
    image: '/src/assets/img/santorini.jfif',
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    description: 'Electric energy meets traditional culture',
    image: '/src/assets/img/Tokyo.avif',
  },
  {
    id: 3,
    name: 'Reykjavik, Iceland',
    description: 'Northern lights and ethereal landscapes',
    image: '/src/assets/img/Reykjavik.jpg',
  },
  {
    id: 4,
    name: 'Bali, Indonesia',
    description: 'Tropical paradise with serene beaches',
    image: '/src/assets/img/Bali.jpg',
  },
  {
    id: 5,
    name: 'Paris, France',
    description: 'Romantic streets and timeless elegance',
    image: '/src/assets/img/Paris.jpg',
  },
])

const filteredSpots = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return mockSpots.value
  return mockSpots.value.filter(
    (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
  )
})

function handleSelectSpot(spot) {
  setSelectedSpot(spot)
}
</script>

<style scoped>
.sidebar {
  position: relative;
  width: 25vw;
  overflow-y: auto;
  overflow-x: visible;
  min-width: 400px;
  border-right: 1px solid var(--sidebar-border);
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
  border-radius: 999px;
  border: 1px solid var(--input);
  padding: 10px 14px 10px 34px;
  background: color-mix(in oklch, var(--background) 60%, transparent);
  color: var(--foreground);
  font-size: 14px;
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
  gap: 12px;
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
