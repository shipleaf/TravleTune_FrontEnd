<template>
  <component
    :is="tag"
    :to="isRouterLink ? href : undefined"
    :href="!isRouterLink ? href : undefined"
    class="ab"
    :class="[sizeClass, block && 'ab--block', $attrs.class]"
    @click="$emit('click', $event)"
  >
    <span class="ab__rainbow" aria-hidden="true"></span>
    <span class="ab__face"><slot /></span>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  href: { type: String, default: '' },
  size: { type: String, default: 'default' }, // sm | default | lg
  block: { type: Boolean, default: false },
})

defineEmits(['click'])

const isRouterLink = computed(() => props.href?.startsWith('/'))
const tag = computed(() => (props.href ? (isRouterLink.value ? RouterLink : 'a') : 'button'))

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'ab--sm'
  if (props.size === 'lg') return 'ab--lg'
  return 'ab--md'
})
</script>

<style lang="scss" scoped>
.ab {
  position: relative;
  display: inline-flex;
  text-decoration: none;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  border-radius: 14px;
}

.ab--block {
  display: flex;
  width: 100%;
}

.ab__rainbow {
  position: absolute;
  inset: -2px;
  border-radius: 14px;
  opacity: 0;
  transition: opacity 0.2s ease;
  background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  background-size: 400% 400%;
  animation: rainbowMove 2s linear infinite;
}

.ab__face {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  color: #000;
  font-weight: 600;
  border-radius: 12px;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.ab:hover .ab__rainbow {
  opacity: 1;
}

.ab:hover .ab__face {
  transform: translateY(-1px);
  background: #f3f4f6;
}

.ab--sm .ab__face {
  padding: 8px 12px;
  font-size: 12px;
}

.ab--md .ab__face {
  padding: 10px 16px;
  font-size: 13px;
}

.ab--lg .ab__face {
  padding: 12px 20px;
  font-size: 16px;
}

@keyframes rainbowMove {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>
