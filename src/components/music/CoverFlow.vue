<template>
  <div class="boxes" ref="boxesRef">
    <div class="box" v-for="(img, idx) in images" :key="idx" :style="{ '--src': `url(${img})` }">
      <span>{{ idx + 1 }}</span>
      <img :src="img" />
    </div>

    <div class="controls">
      <button class="prev" @click="handlePrev">
        <span>Next album</span>
        <svg viewBox="0 0 448 512" width="100" title="Next Album">
          <path
            d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
          ></path>
        </svg>
      </button>
      <button class="next" @click="handleNext">
        <span>Previous album</span>
        <svg viewBox="0 0 448 512" width="100" title="Previous Album">
          <path
            d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"
          ></path>
        </svg>
      </button>
    </div>
  </div>

  <svg class="scroll-icon" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M20 6H23L19 2L15 6H18V18H15L19 22L23 18H20V6M9 3.09C11.83 3.57 14 6.04 14 9H9V3.09M14 11V15C14 18.3 11.3 21 8 21S2 18.3 2 15V11H14M7 9H2C2 6.04 4.17 3.57 7 3.09V9Z"
    ></path>
  </svg>

  <div class="drag-proxy" ref="dragProxyRef"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import gsap from 'https://cdn.skypack.dev/gsap@3.7.0'
import Draggable from 'https://cdn.skypack.dev/gsap@3.7.0/Draggable'

gsap.registerPlugin(Draggable)

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const boxesRef = ref(null)
const dragProxyRef = ref(null)

// GSAP/상태 공유용 변수들
let goBySteps = null
let keyHandler = null
let boxClickHandler = null
let dragInstance = null
let hoverHandler = null
let leaveHandler = null
let hoveredBox = null

// Vue에서 쓸 핸들러 (버튼/키보드 공용)
const handleNext = () => {
  console.log('next click!')
  if (goBySteps) goBySteps(1)
}
const handlePrev = () => {
  console.log('prev click!')
  if (goBySteps) goBySteps(-1)
}

onMounted(() => {
  console.log(props.images)

  const boxesEl = boxesRef.value
  const dragProxyEl = dragProxyRef.value

  if (!boxesEl || !dragProxyEl) {
    console.warn('필요한 DOM 요소를 찾지 못했습니다.')
    return
  }

  const BOXES = gsap.utils.toArray(boxesEl.querySelectorAll('.box'))

  // 기본 위치 세팅
  gsap.set(BOXES, {
    yPercent: -50,
    display: 'block',
  })

  const STAGGER = 0.1
  const DURATION = 1
  const OFFSET = 0

  const LOOP = gsap.timeline({
    paused: true,
    repeat: -1,
    ease: 'none',
  })

  const SHIFTS = [...BOXES, ...BOXES, ...BOXES]

  SHIFTS.forEach((BOX, index) => {
    const BOX_TL = gsap
      .timeline()
      .set(BOX, {
        xPercent: 250,
        rotateY: -50,
        opacity: 0,
        scale: 0.5,
      })
      .to(
        BOX,
        {
          opacity: 1,
          scale: 1,
          duration: 0.1,
        },
        0,
      )
      .to(
        BOX,
        {
          opacity: 0,
          scale: 0.5,
          duration: 0.1,
        },
        0.9,
      )
      .fromTo(
        BOX,
        { xPercent: 250 },
        {
          xPercent: -350,
          duration: 1,
          immediateRender: false,
          ease: 'power1.inOut',
        },
        0,
      )
      .fromTo(
        BOX,
        { rotateY: -50 },
        {
          rotateY: 50,
          immediateRender: false,
          duration: 1,
          ease: 'power4.inOut',
        },
        0,
      )
      .to(
        BOX,
        {
          z: 100,
          scale: 1.25,
          duration: 0.1,
          repeat: 1,
          yoyo: true,
        },
        0.4,
      )
      .fromTo(
        BOX,
        { zIndex: 1 },
        {
          zIndex: BOXES.length,
          repeat: 1,
          yoyo: true,
          ease: 'none',
          duration: 0.5,
          immediateRender: false,
        },
        0,
      )

    LOOP.add(BOX_TL, index * STAGGER)
  })

  const CYCLE_DURATION = STAGGER * BOXES.length
  const START_TIME = CYCLE_DURATION + DURATION * 0.5 + OFFSET

  const LOOP_HEAD = gsap.fromTo(
    LOOP,
    { totalTime: START_TIME },
    {
      totalTime: `+=${CYCLE_DURATION}`,
      duration: 1,
      ease: 'none',
      repeat: -1,
      paused: true,
    },
  )

  const PLAYHEAD = { position: START_TIME }
  const wrapTime = gsap.utils.wrap(0, LOOP_HEAD.duration())

  const SCRUB = gsap.to(PLAYHEAD, {
    position: START_TIME,
    onUpdate: () => {
      LOOP_HEAD.totalTime(wrapTime(PLAYHEAD.position))
    },
    paused: true,
    duration: 0.3,
    ease: 'power3.out',
  })

  const step = LOOP_HEAD.duration() / BOXES.length
  const SNAP = gsap.utils.snap(step)

  function goToPosition(pos) {
    const snapped = SNAP(pos)
    SCRUB.vars.position = snapped
    SCRUB.invalidate().restart()
  }

  // ▶ 외부에서 부를 수 있게 함수 저장
  goBySteps = (delta) => {
    goToPosition(PLAYHEAD.position + step * delta)
  }

  // 키보드
  keyHandler = (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') handlePrev()
    if (event.code === 'ArrowRight' || event.code === 'KeyD') handleNext()
  }
  document.addEventListener('keydown', keyHandler)

  // 🔹 hover 효과: 부드럽게 위/아래
  hoverHandler = (e) => {
    const BOX = e.target.closest('.box')

    // 같은 박스면 아무 것도 안 함
    if (BOX === hoveredBox) return

    // 이전 호버 복원
    if (hoveredBox) {
      gsap.to(hoveredBox, {
        yPercent: -50,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    hoveredBox = BOX

    if (hoveredBox) {
      gsap.to(hoveredBox, {
        yPercent: -60, // 살짝 위로
        duration: 0.25,
        ease: 'power2.out',
      })
    }
  }

  // 영역을 완전히 벗어나면 원래 높이로
  leaveHandler = () => {
    if (hoveredBox) {
      gsap.to(hoveredBox, {
        yPercent: -50,
        duration: 0.25,
        ease: 'power2.out',
      })
      hoveredBox = null
    }
  }

  boxesEl.addEventListener('mousemove', hoverHandler)
  boxesEl.addEventListener('mouseleave', leaveHandler)

  // 🔹 카드 클릭 → emit만 수행
  boxClickHandler = (e) => {
    const BOX = e.target.closest('.box')
    if (!BOX) return

    const targetIndex = BOXES.indexOf(BOX)
    if (targetIndex < 0) return

    emit('select', {
      index: targetIndex,
      src: props.images[targetIndex],
    })
  }
  boxesEl.addEventListener('click', boxClickHandler)

  // 드래그
  dragInstance = Draggable.create(dragProxyEl, {
    type: 'x',
    trigger: boxesEl,
    onPress() {
      this.startOffset = PLAYHEAD.position
    },
    onDrag() {
      const delta = (this.startX - this.x) * 0.01
      SCRUB.vars.position = this.startOffset + delta
      SCRUB.invalidate().restart()
    },
    onDragEnd() {
      goToPosition(PLAYHEAD.position)
    },
  })[0]
})

onBeforeUnmount(() => {
  const boxesEl = boxesRef.value
  if (boxesEl && boxClickHandler) boxesEl.removeEventListener('click', boxClickHandler)
  if (boxesEl && hoverHandler) boxesEl.removeEventListener('mousemove', hoverHandler)
  if (boxesEl && leaveHandler) boxesEl.removeEventListener('mouseleave', leaveHandler)
  if (keyHandler) document.removeEventListener('keydown', keyHandler)
  if (dragInstance) dragInstance.kill()
})
</script>

<style scoped>
:host,
.boxes,
.boxes * {
  box-sizing: border-box;
}

:root {
  --bg: #1a1a1a;
  --min-size: 200px;
}

.drag-proxy {
  visibility: hidden;
  position: absolute;
}

/* 좌우 버튼 컨트롤 */
.controls {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.5);
  display: flex;
  justify-content: space-between;
  min-width: var(--min-size);
  height: 44px;
  width: 20vmin;
  z-index: 300;
}

button {
  height: 48px;
  width: 48px;
  border-radius: 50%;
  position: absolute;
  top: 0%;
  outline: transparent;
  cursor: pointer;
  background: none;
  border: 0;
  transition: transform 0.1s;
  transform: translate(0, calc(var(--y, 0)));
}

button:before {
  border: 2px solid #e6e6e6;
  background: linear-gradient(rgba(204, 204, 204, 0.65), #000) #000;
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 80%;
  width: 80%;
  border-radius: 50%;
}

button:active:before {
  background: linear-gradient(#000, rgba(204, 204, 204, 0.65)) #000;
}

button:nth-of-type(1) {
  right: 100%;
}

button:nth-of-type(2) {
  left: 100%;
}

button:hover {
  --y: -5%;
}

button svg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(0deg) translate(2%, 0);
  height: 30%;
  fill: #e6e6e6;
}

button:nth-of-type(1) svg {
  transform: translate(-50%, -50%) rotate(180deg) translate(2%, 0);
}

/* 상단 스크롤 아이콘 */
.scroll-icon {
  height: 30px;
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #e6e6e6;
  animation: action 4s infinite;
}

/* 커버 플로우 영역 */
.boxes {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  transform-style: preserve-3d;
  perspective: 800px;
  touch-action: none;
}

.box {
  transform-style: preserve-3d;
  position: absolute;
  bottom: 20%;
  left: 50%;
  height: 20vmin;
  width: 20vmin;
  min-height: var(--min-size);
  min-width: var(--min-size);
  display: none;
}

/* Reflection (after element) */
.box:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: 100%;
  background-image: var(--src);
  background-size: cover;
  transform: translate(-50%, -50%) rotate(180deg) translate(0, -100%) translate(0, -0.5vmin);
  opacity: 0.75;
}

/* Gradient shadow */
.box:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width: 100%;
  background: linear-gradient(var(--bg) 50%, transparent);
  transform: translate(-50%, -50%) rotate(180deg) translate(0, -100%) translate(0, -0.5vmin)
    scale(1.01);
  z-index: 2;
}

.box img {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
}

/* Scroll animation */
@keyframes action {
  0%,
  25%,
  50%,
  100% {
    transform: translate(0, 0);
  }
  12.5%,
  37.5% {
    transform: translate(0, 25%);
  }
}
</style>
