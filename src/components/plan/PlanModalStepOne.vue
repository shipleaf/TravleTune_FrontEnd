<template>
  <div class="page">
    <div class="select-region-header">
      <h3>지역을 선택해 주세요.</h3>
    </div>

    <div class="select-region-body">
      <div class="sido-container">
        <div
          v-for="sido in sidoList"
          :key="sido.sido_code"
          class="region-box"
          :class="{ 'is-active': selectedSido === sido.sido_code }"
          @click="handleSelectSido(sido.sido_code)"
        >
          {{ sido.sido_name }}
        </div>
      </div>

      <div v-if="selectedSido" class="gungu-container">
        <div
          v-for="gungu in gunguList"
          :key="gungu.gungu_code"
          class="region-box"
          :class="{ 'is-active': selectedGungu === gungu.gungu_code }"
          @click="handleSelectGungu(gungu.gungu_code)"
        >
          {{ gungu.gungu_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { getGungu, getSido } from '@/api/siGunguApi'
import { useTripStore } from '@/stores/trip'
import { storeToRefs } from 'pinia'

const store = useTripStore()

const { selectedSido, selectedGungu } = storeToRefs(store)

const sidoList = ref([])
const gunguList = ref([])

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
  selectedSido.value = sidoCode

  selectedGungu.value = null
  gunguList.value = []
}

const handleSelectGungu = (gunguCode) => {
  selectedGungu.value = gunguCode
}

watch(selectedSido, (newV) => {
  if (!newV) return
  loadGungu(newV)
})

onMounted(() => {
  loadSido()
  if (selectedSido.value) {
    loadGungu(selectedSido.value)
  }
})
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 600px;
  color: black;

  display: flex;
  flex-direction: column;
}

.select-region-header {
  flex: 0 0 auto;
}

.select-region-body {
  display: flex;
  flex: 1;

  overflow: hidden;
  min-height: 0; // flex 자식 overflow 동작 안정화
}

.sido-container,
.gungu-container {
  display: flex;
  flex-direction: column;

  /* ✅ 각자 스크롤 */
  overflow-y: auto;
  min-height: 0;
}

/* 폭은 취향대로 */
.sido-container {
  flex: 0 0 50%;
  border-right: 1px solid #212121;
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
/* 공통: 스크롤바 공간은 최소화 */
:deep(.sido-container::-webkit-scrollbar),
:deep(.gungu-container::-webkit-scrollbar) {
  width: 6px;
}

/* 트랙은 항상 투명 */
:deep(.sido-container::-webkit-scrollbar-track),
:deep(.gungu-container::-webkit-scrollbar-track) {
  background: transparent;
}

/* ✅ 평소엔 thumb를 투명으로(= 안 보임) */
:deep(.sido-container::-webkit-scrollbar-thumb),
:deep(.gungu-container::-webkit-scrollbar-thumb) {
  background-color: transparent;
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* ✅ hover 또는 내부 클릭(focus) 때만 thumb 보이게 */
:deep(.sido-container:hover::-webkit-scrollbar-thumb),
:deep(.sido-container:focus-within::-webkit-scrollbar-thumb),
:deep(.gungu-container:hover::-webkit-scrollbar-thumb),
:deep(.gungu-container:focus-within::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.35);
}

/* hover 시 조금 더 진하게 */
:deep(.sido-container:hover::-webkit-scrollbar-thumb:hover),
:deep(.gungu-container:hover::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(0, 0, 0, 0.55);
}

/* Firefox(선택): 얇게 + 기본은 거의 안 보이게 */
:deep(.sido-container),
:deep(.gungu-container) {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

:deep(.sido-container:hover),
:deep(.gungu-container:hover) {
  scrollbar-color: rgba(0, 0, 0, 0.35) transparent;
}
</style>
