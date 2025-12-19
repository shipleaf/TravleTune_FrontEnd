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

const sidoList = ref([])
const gunguList = ref([])

const selectedSido = ref(null)
const selectedGungu = ref(null)

const loadSido = async () => {
  try {
    const response = await getSido()
    sidoList.value = response.data.data
  } catch (error) {
    console.error(error)
  }
}

// ✅ selectedSido를 받아서 그 값으로 군구 요청
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
})
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  height: 540px;
  color: black;
}

.select-region-body {
  display: flex;
  flex: 1;
}

.sido-container {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #212121;
}

.sido-box {
  padding: 12px;
  padding-right: 20px;

  &:last-child {
    margin-bottom: 8px;
  }

  &:hover {
    cursor: pointer;
    background-color: #212121;
  }
}

.select-region-body {
  display: flex;
  flex: 1;
}

.sido-container {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #212121;
}

.gungu-container {
  display: flex;
  flex-direction: column;
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
</style>
