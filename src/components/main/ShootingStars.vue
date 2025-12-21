<template>
  <div class="shooting-sky" :style="skyVars">
    <div class="night">
      <div
        v-for="s in stars"
        :key="s.id"
        class="shooting_star"
        :style="{
          top: `calc(50% - ${s.topOffset}px)`,
          left: `calc(50% - ${s.leftOffset}px)`,
          '--delay': `${s.delay}ms`,
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  count: { type: Number, default: 20 },

  // 애니메이션 duration (ms)
  shootingTime: { type: Number, default: 3000 },

  // 별똥별 분포 범위 (px)
  spreadY: { type: Number, default: 400 }, // 위아래 폭
  spreadX: { type: Number, default: 300 }, // 좌우 폭

  // 딜레이 랜덤 범위 (ms)
  maxDelay: { type: Number, default: 9999 },

  // 이동 거리 (px)
  travelX: { type: Number, default: 300 },

  // 꼬리 최대 길이 (px)
  tailWidth: { type: Number, default: 100 },

  // 반짝임 최대 길이 (px)
  shineWidth: { type: Number, default: 30 },
})

function randInt(min, maxInclusive) {
  return Math.floor(Math.random() * (maxInclusive - min + 1)) + min
}

const stars = ref(
  Array.from({ length: props.count }, (_, i) => {
    // 원본 SCSS: top: calc(50% - (random(400)-200px)), left: calc(50% - random(300))
    const topOffset = randInt(-props.spreadY / 2, props.spreadY / 2) // -200 ~ 200
    const leftOffset = randInt(0, props.spreadX) // 0 ~ 300
    const delay = randInt(0, props.maxDelay)

    return {
      id: i + 1,
      topOffset,
      leftOffset,
      delay,
    }
  }),
)

const skyVars = computed(() => ({
  '--shooting-time': `${props.shootingTime}ms`,
  '--travel-x': `${props.travelX}px`,
  '--tail-width': `${props.tailWidth}px`,
  '--shine-width': `${props.shineWidth}px`,
}))
</script>

<style lang="scss" scoped>
.shooting-sky {
  position: relative;
  width: 100%;
  height: 100%;

  /* 원본 body 배경을 컴포넌트로 옮김 */
  background: transparent;
  overflow: hidden;
}

.night {
  position: absolute;
  inset: 0;
  transform: rotateZ(45deg);
}

/* 원본 shooting_star 스타일 */
.shooting_star {
  position: absolute;
  height: 2px;
  left: 50%;
  top: 50%;

  background: linear-gradient(-45deg, rgba(95, 145, 255, 1), rgba(0, 0, 255, 0));
  border-radius: 999px;
  filter: drop-shadow(0 0 6px rgba(105, 155, 255, 1));

  /* ✅ JS로 넣은 --delay를 모든 애니메이션에 적용 */
  animation:
    tail var(--shooting-time) ease-in-out infinite,
    shooting var(--shooting-time) ease-in-out infinite;
  animation-delay: var(--delay);

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: calc(50% - 1px);
    right: 0;
    height: 2px;
    background: linear-gradient(
      -45deg,
      rgba(0, 0, 255, 0),
      rgba(95, 145, 255, 1),
      rgba(0, 0, 255, 0)
    );
    border-radius: 100%;
    animation: shining var(--shooting-time) ease-in-out infinite;
    animation-delay: var(--delay);
  }

  &::before {
    transform: translateX(50%) rotateZ(45deg);
  }

  &::after {
    transform: translateX(50%) rotateZ(-45deg);
  }
}

/* keyframes: CSS 변수로 길이 조절 */
@keyframes tail {
  0% {
    width: 0;
  }
  30% {
    width: var(--tail-width);
  }
  100% {
    width: 0;
  }
}

@keyframes shining {
  0% {
    width: 0;
  }
  50% {
    width: var(--shine-width);
  }
  100% {
    width: 0;
  }
}

@keyframes shooting {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(var(--travel-x));
  }
}
</style>
