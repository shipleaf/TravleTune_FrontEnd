<template>
  <div ref="wrapper" class="intro" aria-hidden="true">
    <video
      ref="videoRef"
      class="intro__video"
      :src="videoSrc"
      autoplay
      muted
      playsinline
      preload="auto"
    ></video>

    <div class="intro__dim"></div>

    <div class="intro__center">
      <div ref="titleRef" class="intro__title">여행의 순간마다, 음악이 함께</div>
      <div ref="subRef" class="intro__subtitle">
        사진 한 장, 한 장소의 분위기에서 당신의 여행에 어울리는 음악을 찾아드려요.
      </div>
    </div>

    <button class="intro__skip" type="button" @click="skip">SKIP</button>
  </div>
</template>

<script setup>
import gsap from 'gsap'
import { onMounted, onBeforeUnmount, ref, nextTick, computed } from 'vue'

const emit = defineEmits(['phase', 'finished'])

const wrapper = ref(null)
const videoRef = ref(null)
const titleRef = ref(null)
const subRef = ref(null)

let tl = null

// ✅ Vite 권장: public에 두면 "/video/Intro.mp4"
// public/video/Intro.mp4 로 옮기는 걸 추천!
const videoSrc = computed(() => '/src/assets/video/Intro.mp4')

// 시연용 시간(원하면 props로 빼도 됨)
const HOLD_SECONDS = 1

const playSafe = async () => {
  try {
    await videoRef.value?.play?.()
  } catch {
    // 자동재생 차단되어도 연출은 진행 가능
  }
}

const buildTimeline = () => {
  const w = wrapper.value
  const t1 = titleRef.value
  const t2 = subRef.value
  if (!w) return

  // 초기 상태 세팅 (깜빡임 방지)
  gsap.set(w, { y: 0, opacity: 1, scale: 1, transformOrigin: '50% 50%' })
  gsap.set([t1, t2], { opacity: 0, y: 28 })

  tl = gsap.timeline()

  // 1) 텍스트 등장
  tl.to(t1, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.2)
  tl.to(t2, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.35)

  // 2) 잠깐 홀드(영상 재생 구간)
  tl.to({}, { duration: HOLD_SECONDS })

  // 3) 중앙으로 축소 + 텍스트는 같이 사라지게
  tl.to([t1, t2], { opacity: 0, y: -10, duration: 0.45, ease: 'power2.out' }, '<')

  tl.to(
    w,
    {
      width: '62vw',
      height: '62vh',
      borderRadius: 24,
      ease: 'power3.inOut',
      duration: 1.15,
      onStart: () => {
        // ✅ 부모에 “스켈레톤 시작해!” 타이밍 알림
        emit('phase', 'shrink')
      },
    },
    '<0.05',
  )

  // 4) 아래로 사라짐
  tl.to(w, {
    y: '120%',
    duration: 0.9,
    ease: 'power3.in',
    onComplete: () => {
      emit('finished')
    },
  })
}

const skip = () => {
  // 타임라인 있으면 즉시 종료 상태로 이동
  if (tl) {
    tl.progress(1)
    tl.kill()
    tl = null
  }
  emit('finished')
}

onMounted(async () => {
  await nextTick()
  await playSafe()
  // 레이아웃 계산 후 타임라인 시작
  requestAnimationFrame(() => {
    buildTimeline()
  })
})

onBeforeUnmount(() => {
  if (tl) {
    tl.kill()
    tl = null
  }
})
</script>

<style lang="scss" scoped>
.intro {
  /* ✅ 페이지를 덮는 오버레이 */
  position: fixed;
  inset: 0;
  z-index: 9999;

  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;

  /* 축소 애니메이션을 위해 중앙 정렬 */
  margin: auto;

  /* 초기에는 풀스크린 */
  border-radius: 0;
}

.intro__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.intro__dim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.28);
  z-index: 1;
}

.intro__center {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  padding: 10% 25%;
  pointer-events: none;
}

.intro__title {
  font-size: 4rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.05;
  text-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
}

.intro__subtitle {
  margin-top: 10px;
  font-size: 2.2rem;
  font-weight: 650;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
}

.intro__skip {
  position: absolute;
  right: 18px;
  top: 18px;
  z-index: 3;

  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;

  backdrop-filter: blur(6px);
}
</style>
