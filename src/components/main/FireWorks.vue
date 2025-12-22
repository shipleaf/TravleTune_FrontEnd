<template>
  <div class="fw-wrap" :style="wrapStyle" aria-hidden="true">
    <canvas ref="trailCanvas" class="fw-canvas fw-trail"></canvas>
    <canvas ref="mainCanvas" class="fw-canvas fw-main" @pointerdown="onPointerDown"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  /** 컨테이너 크기 조절 */
  width: { type: [String, Number], default: '100%' },
  height: { type: [String, Number], default: '100%' },
  /** absolute 배치가 필요하면 true */
  absolute: { type: Boolean, default: true },
  /** 화면 전체 덮기(inset:0) */
  fullscreen: { type: Boolean, default: true },
  /** 클릭으로 발사 허용 */
  interactive: { type: Boolean, default: true },

  /** 성능 옵션 */
  density: { type: Number, default: 1 }, // 0.6~1.2 추천
  autoFire: { type: Boolean, default: true },
  autoFireInterval: { type: Number, default: 520 }, // ms
  maxRockets: { type: Number, default: 10 },
})

const trailCanvas = ref(null)
const mainCanvas = ref(null)

const wrapStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height

  if (props.absolute && props.fullscreen) {
    return { position: 'absolute', inset: '0' }
  }
  if (props.absolute) {
    return { position: 'absolute', width: w, height: h, left: 0, top: 0 }
  }
  return { width: w, height: h }
})

let rafId = 0
let autoTimer = 0

let ctxTrail, ctxMain
let W = 0,
  H = 0,
  dpr = 1

const rockets = []
const sparks = []

const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

function resize() {
  const wrap = mainCanvas.value?.parentElement
  if (!wrap) return

  const rect = wrap.getBoundingClientRect()
  dpr = window.devicePixelRatio || 1
  W = Math.max(1, rect.width)
  H = Math.max(1, rect.height)

  for (const c of [trailCanvas.value, mainCanvas.value]) {
    c.width = Math.floor(W * dpr)
    c.height = Math.floor(H * dpr)
    c.style.width = `${W}px`
    c.style.height = `${H}px`
  }
  ctxTrail.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctxMain.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function makeRocket(
  x = rand(W * 0.2, W * 0.8),
  targetX = rand(W * 0.2, W * 0.8),
  targetY = rand(H * 0.15, H * 0.45),
) {
  if (rockets.length >= props.maxRockets) return

  const startY = H + 10
  const vx = (targetX - x) / rand(55, 85)
  const vy = -(rand(6, 9) * props.density)

  rockets.push({
    x,
    y: startY,
    vx,
    vy,
    targetY,
    life: 0,
    hue: rand(0, 360),
  })
}

function explode(x, y, hue) {
  const count = Math.floor(rand(70, 120) * props.density)

  for (let i = 0; i < count; i++) {
    const a = rand(0, Math.PI * 2)
    const sp = rand(3.5, 9.5) * props.density // ⭐ 반경 증가

    sparks.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp,
      g: 0.07 * props.density,
      drag: 0.982,
      alpha: 1,
      decay: rand(0.008, 0.014), // ⭐ 조금 더 오래 남게
      hue: (hue + rand(-20, 20) + 360) % 360,
      size: rand(1.8, 3.2), // ⭐ 입자 크기 증가
    })
  }
}

function tick() {
  // trails: 살짝 잔상 남기기
  ctxTrail.fillStyle = 'rgba(0,0,0,0.22)'
  ctxTrail.fillRect(0, 0, W, H)

  // main: 매 프레임 깨끗하게(혹은 아주 약하게)
  ctxMain.clearRect(0, 0, W, H)

  // rockets update/draw
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i]
    r.life += 1
    r.x += r.vx
    r.y += r.vy
    r.vy += 0.06 * props.density // gravity

    // rocket trail dot
    ctxTrail.beginPath()
    ctxTrail.fillStyle = `hsla(${r.hue}, 95%, 70%, 0.9)`
    ctxTrail.arc(r.x, r.y, 1.4, 0, Math.PI * 2)
    ctxTrail.fill()

    // rocket head
    ctxMain.beginPath()
    ctxMain.fillStyle = `hsla(${r.hue}, 95%, 65%, 0.95)`
    ctxMain.arc(r.x, r.y, 2.2, 0, Math.PI * 2)
    ctxMain.fill()

    if (r.y <= r.targetY || r.vy >= 0) {
      explode(r.x, r.y, r.hue)
      rockets.splice(i, 1)
    }
  }

  // sparks update/draw
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i]
    p.vx *= p.drag
    p.vy *= p.drag
    p.vy += p.g

    p.x += p.vx
    p.y += p.vy

    p.alpha -= p.decay
    if (p.alpha <= 0 || p.y > H + 40) {
      sparks.splice(i, 1)
      continue
    }

    ctxTrail.beginPath()
    ctxTrail.fillStyle = `hsla(${p.hue}, 95%, 70%, ${clamp(p.alpha, 0, 1)})`
    ctxTrail.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctxTrail.fill()
  }

  rafId = requestAnimationFrame(tick)
}

function startAutoFire() {
  stopAutoFire()
  if (!props.autoFire) return
  autoTimer = window.setInterval(() => {
    makeRocket()
  }, props.autoFireInterval)
}

function stopAutoFire() {
  if (autoTimer) {
    clearInterval(autoTimer)
    autoTimer = 0
  }
}

function onPointerDown(e) {
  if (!props.interactive) return
  const rect = mainCanvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  // 클릭 지점으로 터지게: 로켓을 클릭 지점 근처로 쏘기
  makeRocket(rand(x - 40, x + 40), x, y)
}

onMounted(() => {
  ctxTrail = trailCanvas.value.getContext('2d', { alpha: true })
  ctxMain = mainCanvas.value.getContext('2d', { alpha: true })

  resize()
  window.addEventListener('resize', resize)

  // 첫 연출
  for (let i = 0; i < 2; i++) makeRocket()

  startAutoFire()
  tick()
})

watch(
  () => [props.autoFire, props.autoFireInterval, props.density],
  () => startAutoFire(),
)

onBeforeUnmount(() => {
  stopAutoFire()
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<style lang="scss" scoped>
.fw-wrap {
  pointer-events: none; // 기본은 배경처럼
  overflow: hidden;
  border-radius: 0;
}

.fw-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* trail은 아래, main은 위 */
.fw-trail {
  opacity: 0.95;
}

.fw-main {
  opacity: 1;
}

/* interactive=true면 클릭 받게 */
:deep(.fw-main) {
  pointer-events: auto;
}
</style>
