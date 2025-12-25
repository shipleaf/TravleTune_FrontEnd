<template>
  <div class="page">
    <div class="select-region-header">
      <h3>지역을 선택해주세요</h3>
    </div>

    <div class="category-bar">
      <div class="category-title">관광지 카테고리</div>
      <div class="category-options">
        <button
          v-for="category in categoryList"
          :key="category.value"
          type="button"
          class="category-pill"
          :class="{ 'is-active': selectedCategory === category.value }"
          @click="handleSelectCategory(category.value)"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <div class="select-region-body">
      <div class="sido-container">
        <div
          v-for="sido in sidoList"
          :key="sido.sido_code"
          class="region-box"
          :class="{ 'is-active': sido_code === sido.sido_code }"
          @click="handleSelectSido(sido.sido_code)"
        >
          {{ sido.sido_name }}
        </div>
      </div>

      <div v-if="sido_code" class="gungu-container">
        <div
          v-for="gungu in gunguList"
          :key="gungu.gungu_code"
          class="region-box"
          :class="{ 'is-active': gungu_code === gungu.gungu_code }"
          @click="handleSelectGungu(gungu.gungu_code)"
        >
          {{ gungu.gungu_name }}
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button type="button" class="btn cancel" @click="handleCancel">취소</button>
      <button type="button" class="btn confirm" @click="handleConfirm">확인</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { getGungu, getSido } from '@/api/siGunguApi'
import { useFilterStore } from '@/stores/filter'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['close', 'apply'])

const filterStore = useFilterStore()
const { sido_code, gungu_code, content_type } = storeToRefs(filterStore)

const sidoList = ref([])
const gunguList = ref([])
const categoryList = [
  { value: 'all', label: '전체' },
  { value: 12, label: '관광지' },
  { value: 14, label: '문화시설' },
  { value: 15, label: '축제/공연/행사' },
  { value: 25, label: '여행코스' },
  { value: 28, label: '레포츠' },
  { value: 32, label: '숙박' },
  { value: 38, label: '쇼핑' },
  { value: 39, label: '음식점' },
]
const selectedCategory = computed({
  get: () => content_type.value ?? 'all',
  set: (val) => {
    content_type.value = val
  },
})

const loadSido = async () => {
  try {
    const response = await getSido()
    sidoList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const loadGungu = async (sidoCode) => {
  try {
    const response = await getGungu(sidoCode)
    gunguList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

const handleSelectSido = (sidoCode) => {
  sido_code.value = sidoCode
  gungu_code.value = null
  gunguList.value = []
}

const handleSelectGungu = (gunguCode) => {
  gungu_code.value = gunguCode
}

const handleSelectCategory = (category) => {
  content_type.value = category
}

const handleCancel = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('apply', {
    category: content_type.value,
    sido: sido_code.value,
    gungu: gungu_code.value,
  })
  emit('close')
}

watch(sido_code, (newV) => {
  if (!newV) return
  loadGungu(newV)
})

onMounted(() => {
  loadSido()
  if (sido_code.value) {
    loadGungu(sido_code.value)
  }
})
</script>

<style lang="scss" scoped>
.page {
  background-color: white;
  width: 600px;
  height: 600px;
  padding: 16px;
  color: black;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.select-region-header {
  flex: 0 0 auto;
}

.category-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-title {
  font-weight: 600;
}

.category-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-pill {
  border: 1px solid #d1d5db;
  background: #f8fafc;
  color: #111827;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.15s ease;

  &.is-active {
    background: #111827;
    color: #fff;
    border-color: #111827;
  }

  &:hover {
    border-color: #111827;
  }
}

.select-region-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.sido-container,
.gungu-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-height: 0;
}

.sido-container {
  flex: 0 0 50%;
  border-right: 1px solid #e5e7eb;
}

.gungu-container {
  flex: 1 1 50%;
}

.region-box {
  padding: 12px 20px 12px 12px;

  &:hover {
    cursor: pointer;
    background-color: #212121;
    color: #fff;
  }

  &.is-active {
    background-color: #212121;
    color: #fff;
  }
}

:deep(.sido-container::-webkit-scrollbar),
:deep(.gungu-container::-webkit-scrollbar) {
  width: 6px;
}

:deep(.sido-container::-webkit-scrollbar-track),
:deep(.gungu-container::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.sido-container::-webkit-scrollbar-thumb),
:deep(.gungu-container::-webkit-scrollbar-thumb) {
  background-color: transparent;
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

:deep(.sido-container:hover::-webkit-scrollbar-thumb),
:deep(.sido-container:focus-within::-webkit-scrollbar-thumb),
:deep(.gungu-container:hover::-webkit-scrollbar-thumb),
:deep(.gungu-container:focus-within::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.35);
}

:deep(.sido-container:hover::-webkit-scrollbar-thumb:hover),
:deep(.gungu-container:hover::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(0, 0, 0, 0.55);
}

:deep(.sido-container),
:deep(.gungu-container) {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

:deep(.sido-container:hover),
:deep(.gungu-container:hover) {
  scrollbar-color: rgba(0, 0, 0, 0.35) transparent;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn {
  border: 1px solid transparent;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;

  &.cancel {
    background: #f3f4f6;
    color: #111827;
    border-color: #e5e7eb;

    &:hover {
      background: #e5e7eb;
    }
  }

  &.confirm {
    background: #111827;
    color: #fff;

    &:hover {
      background: #0f172a;
    }
  }
}
</style>
