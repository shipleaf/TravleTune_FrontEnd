<script setup>
import { computed, ref } from 'vue'
import { login, signup } from '@/api/memberApi'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignupForm from '@/components/auth/SignupForm.vue'

const props = defineProps({
  mode: { type: String, default: 'login' },
})

const title = computed(() => (props.mode === 'signup' ? '회원가입' : '로그인'))
const description = computed(() =>
  props.mode === 'signup'
    ? '필수 정보를 입력하고 바로 회원가입을 진행해보세요.'
    : '등록된 이메일과 비밀번호로 로그인 후 이동합니다.',
)

const loading = ref(false)
const message = ref('')
const error = ref('')
const signupFormRef = ref(null)

const resetStatus = () => {
  message.value = ''
  error.value = ''
}

const handleLogin = async ({ email, password }) => {
  resetStatus()

  if (!email || !password) {
    error.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  loading.value = true
  try {
    await login({ email, password })
    message.value = '로그인에 성공했어요.'
  } catch (err) {
    error.value = err?.response?.data?.message || '로그인에 실패했어요.'
  } finally {
    loading.value = false
  }
}

const handleSignup = async ({ email, password, confirmPassword }) => {
  resetStatus()

  if (!email || !password || !confirmPassword) {
    error.value = '모든 항목을 입력해주세요.'
    return
  }

  if (password !== confirmPassword) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }

  loading.value = true
  try {
    await signup({ email, password })
    message.value = '회원가입에 성공했어요. 로그인해주세요.'
    signupFormRef.value?.resetPasswords()
  } catch (err) {
    error.value = err?.response?.data?.message || '회원가입에 실패했어요.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="page">
    <p class="eyebrow">Access</p>
    <h1>{{ title }}</h1>
    <p class="lead">{{ description }}</p>

    <div class="panel-grid">
      <div class="panel">
        <h2>로그인</h2>
        <p class="subtle">등록된 이메일과 비밀번호로 로그인하세요.</p>
        <LoginForm :loading="loading" @submit="handleLogin" />
      </div>
      <div class="panel">
        <h2>회원가입</h2>
        <p class="subtle">필수 정보를 입력하고 맞춤 추천을 받아보세요.</p>
        <SignupForm ref="signupFormRef" :loading="loading" @submit="handleSignup" />
      </div>
    </div>
    <div v-if="message || error" class="panel">
      <p v-if="message" class="subtle">{{ message }}</p>
      <p v-if="error" class="subtle" style="color: #d14343">{{ error }}</p>
    </div>
  </section>
</template>
