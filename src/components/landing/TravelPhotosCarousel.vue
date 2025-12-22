<template>
  <div class="carousel">
    <div class="carousel__overlay"></div>

    <div class="carousel__rows">
      <div
        v-for="(row, rowIndex) in travelPhotos"
        :key="rowIndex"
        class="carousel__row"
        :style="{ marginLeft: rowIndex % 2 === 0 ? '0px' : '200px' }"
      >
        <div
          v-for="(photo, i) in tripled(row)"
          :key="`${rowIndex}-${i}`"
          class="carousel__card"
          :style="cardStyle(rowIndex)"
        >
          <!-- 외부 이미지라 그냥 img 사용 (CORS/next.config 이슈 X) -->
          <img :src="photo" :alt="`Travel destination ${i + 1}`" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const travelPhotos = [
  [
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/c9b9fbf9-dbe3-4440-89ca-f6d94eb3cb53/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/1c621626-3842-4623-aa17-79c1b7b98cec/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/d54b40db-2fcc-43aa-b8bc-1e4648b567f4/it11',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/7a821414-2113-48b6-a54b-1a90caba42ce/it11',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/73979a4a-95cf-47c4-a7d7-947d5179f6f4/it11',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/efd0e03e-70ab-4f0b-a846-93a31ac117b3/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/68474459-b510-4cee-ab9d-c2004dd6a94a/it11',
  ],
  [
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/e5d7be45-c7c3-424f-bedc-a217291222b7/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/5abd16d4-e180-4224-bd7f-d7ce7d87b329/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/583aa39b-3571-4df4-bcfd-7e90a8e8459d/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/75fbfe84-0b89-4134-b61c-1682f823d317/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/cc1156bf-607e-4e93-9ffa-9d3dc2578384/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/2f587225-2558-4e55-bf47-72cf7454cc4a/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/51035cf5-0ac3-401e-aa74-e239954189e9/it14',
  ],
  [
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/467f2c9f-6017-4f27-b13f-3b040c7284bf/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/c37b1ad7-9326-431b-ac84-b05fdc2c94cc/it11',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/cab85ff2-3560-4b2e-9cd5-b60df493bf6e/it11',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/767d46b2-90c5-4fea-8d78-978468d57216/it11',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/1633d789-ff08-4173-8eef-b0a161ee7b7f/it11',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/120a4ed1-425a-43f4-b593-308681bdd6b7/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/32d1403a-dc0d-491e-b187-c5aba1d02bab/it11',
  ],
  [
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/3f94dae5-9aae-444d-8f70-074c966befd5/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/7ababc2e-947b-4652-84cf-8529f7e15bbe/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/fc031487-69ca-4258-bfbf-fd229c55298c/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/aab29d0e-3000-4418-8b9c-94ed6aa67e28/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/0265ec10-7d4f-4fc2-861e-cb30fdfcde0e/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/9dfc96e1-bf5f-41af-a950-5c5e22b4d7fc/it14',
    'https://conlab.visitkorea.or.kr/api/depot/public/depot-flow/query/download-image/ef520899-a3a4-4203-b613-a0b18afac7ff/it14',
  ],
]

// ✅ 카드 폭 + gap 기준으로 loop 길이를 계산해야 함
const CARD_W = 400
const GAP = 16
const STEP = CARD_W + GAP

const offsets = ref([0, 0, 0, 0])
const timers = []

function tripled(row) {
  return [...row, ...row, ...row]
}

function tickRow(rowIndex, speedMs) {
  // React 코드처럼 setInterval도 가능하지만,
  // 여기서는 부드럽게(그리고 CPU 덜 쓰게) ms를 크게 잡아도 됨
  const id = window.setInterval(() => {
    const rowLen = travelPhotos[rowIndex].length
    const loopWidth = rowLen * STEP // 한 번의 “원본 row” 길이만큼만 modulo
    offsets.value[rowIndex] = (offsets.value[rowIndex] + 1) % loopWidth
  }, speedMs)
  timers.push(id)
}

function cardStyle(rowIndex) {
  return {
    transform: `translate3d(-${offsets.value[rowIndex]}px, 0, 0)`,
  }
}

onMounted(() => {
  const speeds = [18, 22, 16, 20] // 줄마다 속도 다르게
  speeds.forEach((ms, idx) => tickRow(idx, ms))
})

onBeforeUnmount(() => {
  timers.forEach((t) => clearInterval(t))
})
</script>

<style scoped lang="scss">
.carousel {
  position: absolute;
  inset: 0;
  overflow: hidden;

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.68);
    backdrop-filter: blur(1px);
  }

  &__rows {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 16px;
    padding: 32px 0;
  }

  &__row {
    display: flex;
    gap: 16px;
    overflow: hidden;
    will-change: transform;
  }

  &__card {
    flex: 0 0 auto;
    width: 400px;
    height: 240px;
    border-radius: 14px;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    transition: transform 50ms linear;
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      filter: saturate(1.05) contrast(1.05);
    }
  }
}
</style>
