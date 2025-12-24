<template>
  <div class="intro">
    <!-- Background Video -->
    <video
      ref="videoRef"
      class="intro__video"
      src="/src/assets/video/Intro.mp4"
      autoplay
      muted
      playsinline
      preload="auto"
    ></video>

    <div class="intro__dim"></div>

    <!-- Center Text -->
    <div class="intro__center">
      <div class="intro__title" :class="{ 'is-show': isShow }">여행의 순간마다, 음악이 함께</div>
      <div class="intro__subtitle" :class="{ 'is-show': isShow }">
        사진 한 장, 한 장소의 분위기에서 당신의 여행에 어울리는 음악을 찾아드려요.
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'

const videoRef = ref(null)
const isShow = ref(false)

onMounted(async () => {
  // ✅ 렌더 완료 후에 텍스트 애니메이션 시작
  await nextTick()

  // (선택) 비디오가 바로 안 도는 케이스 대비: play 시도
  try {
    await videoRef.value?.play?.()
  } catch (e) {
    // autoplay 정책 때문에 막힐 수 있는데, muted면 대부분 통과합니다.
  }

  // 약간의 딜레이 주면 "비디오 먼저" 느낌 더 확실
  requestAnimationFrame(() => {
    setTimeout(() => {
      isShow.value = true
    }, 200)
  })
})
</script>

<style lang="scss" scoped>
.intro {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.intro__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* ✅ 화면 꽉 채우기 */
  z-index: 0;
}

/* 가독성용 딤(원치 않으면 제거) */
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

.intro__title,
.intro__subtitle {
  opacity: 0;
  transform: translateY(28px); /* ✅ 아래에서 시작 */
  transition:
    opacity 700ms ease,
    transform 700ms ease;
  will-change: transform, opacity;
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
  font-size: 3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
  transition-delay: 120ms; /* ✅ 타이틀 다음에 살짝 늦게 */
}

.is-show {
  opacity: 1;
  transform: translateY(0); /* ✅ 중앙으로 올라오며 등장 */
}
</style>
