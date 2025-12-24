<template>
  <div class="success-page">
    <div class="hero" :class="{ shrink: isShrunk }">
      <div class="emoji" aria-hidden="true">🎉</div>
      <h1 class="title">회원가입을 축하합니다!</h1>
      <p class="desc">관광지별 추천 음악을 만나보세요!</p>
    </div>

    <!-- 애니메이션 끝난 뒤 버튼 노출(원하면) -->
    <div class="actions" :class="{ show: showActions }">
      <button class="btn primary" type="button" @click="goMain">메인페이지 이동</button>
      <button class="btn ghost" type="button" @click="skip">건너뛰기</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isShrunk = ref(false)
const showActions = ref(false)

let t1, t2

onMounted(() => {
  // 1.5초 정도 크게 보여주기
  t1 = setTimeout(() => {
    isShrunk.value = true

    // shrink 애니메이션 끝나갈 때 버튼 등장 (transition 시간과 맞추기)
    t2 = setTimeout(() => {
      showActions.value = true
    }, 900) // 👈 아래 CSS에서 900ms로 늘릴 예정
  }, 1500) // 👈 1000 -> 1500
})

onBeforeUnmount(() => {
  clearTimeout(t1)
  clearTimeout(t2)
})

const goMain = () => router.push('/login')
const skip = () => router.push('/login')
</script>

<style lang="scss" scoped>
$page-blue: oklch(0.75 0.15 195);

.success-page {
  width: 100%;
  min-height: 100vh;
  background: #000;
  display: grid;
  place-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.hero {
  width: min(520px, 92vw);
  padding: 28px 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  text-align: center;

  // ✅ 처음엔 크게 (가운데)
  transform: translateY(0) scale(3);
  opacity: 1;

  // ✅ 부드럽게 줄어들기
  transition:
    transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
    // 550ms -> 900ms
    opacity 900ms ease;

  .emoji {
    font-size: 56px;
    margin-bottom: 10px;
  }

  .title {
    margin: 0;
    color: #fff;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .desc {
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    line-height: 1.6;
  }

  &.shrink {
    transform: translateY(0) scale(0.92);
  }
}

.actions {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 48px;

  display: flex;
  gap: 10px;

  opacity: 0;
  pointer-events: none;
  transition:
    opacity 250ms ease,
    transform 250ms ease;

  &.show {
    opacity: 1;
    pointer-events: auto;
    transform: translateX(-50%) translateY(0);
  }
}

.btn {
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.primary {
    background: $page-blue;
    border-color: $page-blue;
    color: #000;

    &:hover {
      opacity: 0.92;
    }
  }

  &.ghost {
    background: transparent;
  }
}
</style>
