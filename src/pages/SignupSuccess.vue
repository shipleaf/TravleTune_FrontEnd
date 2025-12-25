<template>
  <div class="success-page">
    <div class="hero" :class="{ shrink: isShrunk }">
      <div class="emoji" aria-hidden="true">✨</div>
      <h1 class="title">회원가입이 완료되었습니다</h1>
      <p class="desc">여행과 음악으로 가득한 순간을 준비했어요.</p>
      <div class="subtext">추가 정보를 입력해 맞춤 추천을 받아보세요.</div>
    </div>

    <div class="actions" :class="{ show: showActions }">
      <button class="btn primary" type="button" @click="goExtra">추가 정보 입력</button>
      <button class="btn ghost" type="button" @click="goLogin">로그인 화면으로</button>
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
  t1 = setTimeout(() => {
    isShrunk.value = true
    t2 = setTimeout(() => {
      showActions.value = true
    }, 900)
  }, 1500)
})

onBeforeUnmount(() => {
  clearTimeout(t1)
  clearTimeout(t2)
})

const goExtra = () => router.push('/extra-info')
const goLogin = () => router.push('/login')
</script>

<style lang="scss" scoped>
$page-blue: oklch(0.75 0.15 195);

.success-page {
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at 15% 20%, rgba(59, 130, 246, 0.18), transparent 42%),
    radial-gradient(circle at 85% 15%, rgba(236, 72, 153, 0.16), transparent 40%),
    #05060d;
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

  transform: translateY(0) scale(3);
  opacity: 1;
  transition:
    transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
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

  .subtext {
    margin-top: 12px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
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
