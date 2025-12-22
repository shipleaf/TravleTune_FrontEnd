<template>
  <div ref="root" class="stats">
    <div v-for="(stat, idx) in stats" :key="idx" class="stats__item">
      <div class="stats__value">
        <span class="stats__num"> {{ counts[idx] }}{{ stat.suffix }} </span>
        <span class="stats__glow" />
      </div>
      <div class="stats__label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  stats: {
    type: Array,
    required: true,
    // [{ value: number, suffix: string, label: string }]
  },
})

const root = ref(null)
const counts = ref(props.stats.map(() => 0))
const started = ref(false)

let observer
const intervals = []

function startCounting() {
  if (started.value) return
  started.value = true

  props.stats.forEach((stat, index) => {
    let current = 0
    const end = Number(stat.value || 0)
    const duration = 2000
    const frame = 16
    const step = end / (duration / frame)

    const id = window.setInterval(() => {
      current += step
      if (current >= end) {
        current = end
        clearInterval(id)
      }
      const next = [...counts.value]
      next[index] = Math.floor(current)
      counts.value = next
    }, frame)

    intervals.push(id)
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) startCounting()
    },
    { threshold: 0.3 },
  )

  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  if (observer && root.value) observer.unobserve(root.value)
  intervals.forEach((id) => clearInterval(id))
})

// stats가 바뀌면 리셋(원하면 제거 가능)
watch(
  () => props.stats,
  (next) => {
    counts.value = next.map(() => 0)
    started.value = false
  },
)
</script>

<style scoped lang="scss">
.stats {
  width: 100%;
  max-width: 720px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
  padding-top: 28px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  &__item {
    text-align: left;
    position: relative;
  }

  &__value {
    position: relative;
    font-size: 30px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 6px;
    text-shadow:
      0 0 30px rgba(59, 130, 246, 0.8),
      0 0 60px rgba(147, 51, 234, 0.6);
  }

  &__num {
    position: relative;
    z-index: 2;
    animation: statPulse 2s ease-in-out infinite;
  }

  &__glow {
    position: absolute;
    inset: -14px;
    z-index: 1;
    border-radius: 12px;
    filter: blur(18px);
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.25),
      rgba(147, 51, 234, 0.25),
      rgba(236, 72, 153, 0.25)
    );
    animation: glowBreath 2s ease-in-out infinite;
    opacity: 0.7;
  }

  &__label {
    font-size: 13px;
    color: rgba(156, 163, 175, 1);
  }
}

@keyframes glowBreath {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(1.12);
  }
}

@keyframes statPulse {
  0%,
  100% {
    transform: scale(1);
    text-shadow:
      0 0 30px rgba(59, 130, 246, 0.8),
      0 0 60px rgba(147, 51, 234, 0.6);
  }
  50% {
    transform: scale(1.05);
    text-shadow:
      0 0 40px rgba(147, 51, 234, 1),
      0 0 80px rgba(236, 72, 153, 0.8);
  }
}
</style>
