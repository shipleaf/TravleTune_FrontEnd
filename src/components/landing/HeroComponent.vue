<template>
  <section class="hero">
    <!-- Background -->
    <div class="hero__bg">
      <TravelPhotosCarousel />
    </div>

    <!-- Content -->
    <div class="hero__container">
      <div class="hero__inner">
        <div class="hero__badge">
          <span class="hero__dot" />
          <span>여행 분위기에 딱 맞는 음악 추천</span>
        </div>

        <h1 class="hero__title">
          <span class="hero__titleLine">여행의 순간을</span>
          <span class="hero__titleLine">음악으로 더 선명하게</span>
          <span class="hero__brand">TravelTune</span>
          <span class="hero__subtitle">장소 · 분위기 · 감성에 맞춘 추천</span>
        </h1>

        <p class="hero__desc">
          마음에 드는 관광지를 선택하거나, 직접 사진 혹은 내용을 입력하면 그 장소의 분위기에 맞는
          음악과 여행 이미지를 함께 추천해요.
        </p>

        <div class="hero__actions">
          <a class="hero__cta" href="/get-started">
            <span>지금 노래 추천받기</span>
            <span class="hero__arrow">→</span>
          </a>

          <div class="hero__sponsor">
            <div class="hero__sponsorIcon">
              <!-- public/assets/logo/Primary_Logo_Green_CMYK.svg -->
              <!-- <img src="/assets/logo/Primary_Logo_Green_CMYK.svg" alt="Spotify" /> -->
            </div>
            <div class="hero__sponsorText">
              <p class="hero__sponsorTitle">스포티파이 기반 추천</p>
              <p class="hero__sponsorSub">취향 + 분위기 매칭</p>
            </div>
          </div>

          <CountingStats :stats="stats" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TravelPhotosCarousel from './TravelPhotosCarousel.vue'
import CountingStats from './CountingStats.vue'

const stats = [
  { value: 500, suffix: '+', label: 'Successful Campaigns' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 15, suffix: 'M+', label: 'Revenue Generated' },
]
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 96px;
  padding-bottom: 64px;
  overflow: hidden;
  background: #000;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 16px;
  }

  &__inner {
    max-width: 820px;
    text-align: left;
  }

  /* 간단한 등장 애니메이션 */
  &__inner {
    animation: heroIn 0.8s ease forwards;
    opacity: 0;
    transform: translateY(16px);
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    border-radius: 999px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: linear-gradient(
      90deg,
      rgba(59, 130, 246, 0.18),
      rgba(147, 51, 234, 0.18),
      rgba(236, 72, 153, 0.18)
    );
    backdrop-filter: blur(8px);
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
    animation: pulse 1.4s ease-in-out infinite;
  }

  &__title {
    margin-top: 20px;
    margin-bottom: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: #fff;
  }

  &__titleLine {
    display: block;
    font-size: clamp(28px, 4vw, 56px);
    margin-bottom: 10px;
  }

  &__brand {
    display: block;
    font-size: clamp(34px, 5vw, 64px);
    margin: 10px 0 12px;
    background: linear-gradient(90deg, #60a5fa, #a78bfa, #fb7185);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 40px rgba(147, 51, 234, 0.45);
    font-family:
      ui-rounded,
      system-ui,
      -apple-system,
      'Segoe UI',
      Roboto,
      sans-serif;
  }

  &__subtitle {
    display: block;
    font-size: clamp(14px, 1.8vw, 18px);
    color: rgba(209, 213, 219, 0.95);
  }

  &__desc {
    margin-top: 16px;
    max-width: 680px;
    color: rgba(209, 213, 219, 0.95);
    font-size: clamp(16px, 2vw, 20px);
    line-height: 1.8;
  }

  &__actions {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: flex-start;
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 18px;
    border-radius: 14px;
    background: #fff;
    color: #000;
    font-weight: 700;
    text-decoration: none;
    transition:
      transform 0.15s ease,
      background 0.15s ease;

    &:hover {
      transform: translateY(-1px);
      background: #f3f4f6;
    }
  }

  &__arrow {
    font-size: 18px;
    transform: translateY(-1px);
  }

  &__sponsor {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  &__sponsorIcon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);

    img {
      width: 22px;
      height: 22px;
      display: block;
      object-fit: contain;
    }
  }

  &__sponsorTitle {
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    margin: 0;
  }

  &__sponsorSub {
    color: rgba(156, 163, 175, 1);
    font-size: 12px;
    margin: 2px 0 0;
  }
}

@keyframes heroIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}
</style>
