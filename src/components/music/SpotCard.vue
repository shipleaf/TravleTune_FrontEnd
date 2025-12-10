<template>
  <div class="spot-card" :class="{ 'spot-card--active': isActive }" @click="emit('click')">
    <div class="spot-card-image-wrapper">
      <img class="spot-card-image" :src="image || '/placeholder.svg'" :alt="name" />
      <div class="spot-card-image-gradient" />
      <div class="spot-card-badge">
        <span>♫</span>
      </div>
    </div>
    <div class="spot-card-content">
      <div class="spot-card-title-row">
        <div class="spot-card-pin">
          <Icon icon="ic:outline-location-on" width="20" color="white" />
        </div>
        <div class="spot-card-title">
          {{ name }}
        </div>
      </div>
      <div class="spot-card-description">
        {{ description }}
      </div>
    </div>
    <div v-if="isActive" class="spot-card-active-bar"></div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
  name: String,
  description: String,
  image: String,
  isActive: Boolean,
})

const emit = defineEmits(['click'])
</script>

<style scoped>
/* Spot card */

.spot-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: color-mix(in oklch, var(--card) 80%, transparent);
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.5);
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.spot-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 32px rgba(15, 23, 42, 0.75);
  border-color: color-mix(in oklch, var(--primary) 60%, var(--border));
}

.spot-card--active {
  border-color: var(--primary);
  background: color-mix(in oklch, var(--card) 80%, var(--primary) 12%);
  box-shadow:
    0 0 0 1px rgba(56, 189, 248, 0.8),
    0 18px 40px rgba(56, 189, 248, 0.25);
}

.spot-card-image-wrapper {
  position: relative;
  height: 130px;
  overflow: hidden;
}

.spot-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.spot-card:hover .spot-card-image .spot-card-image-gradient {
  transform: scale(1.05);
}

.spot-card-image-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent 70%);
}

.spot-card-badge {
  position: absolute;
  right: 10px;
  bottom: 8px;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.18);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--primary);
}

.spot-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.spot-card-title-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.spot-card-title {
  font-weight: 600;
  font-size: 20px;
}

.spot-card-description {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.4;
}

/* 선택된 카드 왼쪽 강조 라인 */
.spot-card-active-bar {
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background: var(--primary);
}
</style>
