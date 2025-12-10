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
            placeholder="Search travel spots..."
          />
          <span class="sidebar-search-icon">🔍</span>
        </div>
        <button type="button" class="sidebar-search-button">Search</button>
      </div>

      <!-- 검색 결과 리스트 -->
      <div class="sidebar-list">
        <SpotCard
          v-for="spot in filteredSpots"
          :key="spot.id"
          :name="spot.name"
          :description="spot.description"
          :image="spot.image"
          :is-active="selectedSpot && selectedSpot.id === spot.id"
          @click="handleSelectSpot(spot)"
        />
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import SpotCard from './SpotCard.vue'

defineProps({
  selectedSpot: Object,
})

const emit = defineEmits(['select-spot'])

const keyword = ref('')

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
  emit('select-spot', spot)
}
</script>

<style scoped>
.sidebar {
  width: 25vw;
  overflow: auto;
  min-width: 400px;
  border-right: 1px solid var(--sidebar-border);
  background: color-mix(in oklch, var(--sidebar) 80%, transparent);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
}

.sidebar-inner {
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
}

.sidebar-search-input {
  width: 100%;
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

.sidebar-search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
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
</style>
