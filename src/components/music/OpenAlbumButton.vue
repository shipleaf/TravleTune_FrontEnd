<template>
  <button class="play-btn" type="button">
    <span class="icon" aria-hidden="true">
      <!-- Arrow (기본) -->
      <svg class="icon-svg arrow" viewBox="0 0 24 24" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.003 14H3.5v-4h11.502l-4.165-4.538 2.705-2.947 7.353 8.012c.747.813.747 2.133 0 2.947l-7.353 8.011-2.705-2.947L15.003 14z"
          fill="#F0F0F0"
        />
      </svg>

      <!-- Play (hover) -->
      <svg class="icon-svg play" viewBox="0 0 24 24" fill="none">
        <path d="M9 7.5v9l8-4.5-8-4.5z" fill="#F0F0F0" />
      </svg>
    </span>

    <span class="label">Play Now</span>
  </button>
</template>

<script setup>
// JS 필요 없음 (hover는 CSS로 처리)
</script>

<style scoped lang="scss">
.play-btn {
  cursor: pointer;
  padding: 12px;
  border: 0;
  border-radius: 24px;
  display: inline-flex;
  align-items: center;
  gap: 16px;

  background: linear-gradient(to right, #2891c5, #13b6da);
  transition:
    box-shadow 0.5s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: 0 15px 50px -15px #13b6da;
    transform: translateY(-1px);
  }
}

.icon {
  height: 48px;
  width: 48px;
  background: #0a0a0a;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  border-radius: 999px;
  padding: 12px;

  display: grid;
  place-items: center;
  position: relative; // ✅ 겹쳐놓기

  .icon-svg {
    position: absolute;
    inset: 12px; // padding과 동일하게
    width: auto;
    height: auto;
    transform-origin: center;
  }
}

/* ✅ 기본 상태: 화살표 보이고, 재생 숨김 */
.arrow {
  opacity: 1;
  transform: rotate(0deg) scale(1);
  animation: icon-in 0.45s;
}

.play {
  opacity: 0;
  transform: rotate(-180deg) scale(1.35); // 🔥 기본 크기 크게
}

/* ✅ Hover 상태: 화살표 숨기고, 재생 나타남 (Uiverse 느낌) */
.play-btn:hover .arrow {
  opacity: 0;
  transform: rotate(180deg) scale(0);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.play-btn:hover .play {
  opacity: 1;
  transform: rotate(0deg) scale(1.35); // 동일한 크기 유지
  animation: icon-in 0.45s;
}

/* Uiverse 스타일 애니메이션 */
@keyframes icon-in {
  0% {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }
  50% {
    transform: rotate(-10deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

.label {
  font-size: 1.9rem;
  font-weight: 700;
  color: #fff;
  padding-right: 12px;
  line-height: 1;
}
</style>
