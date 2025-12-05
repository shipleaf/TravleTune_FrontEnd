<script setup>
import { reactive } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const handleSubmit = () => {
  emit('submit', { ...form })
}

const resetPasswords = () => {
  form.password = ''
  form.confirmPassword = ''
}

defineExpose({ resetPasswords })
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <label>
      이메일
      <input v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email" />
    </label>
    <label>
      비밀번호
      <input v-model="form.password" type="password" placeholder="최소 8자" autocomplete="new-password" />
    </label>
    <label>
      비밀번호 확인
      <input v-model="form.confirmPassword" type="password" placeholder="다시 입력" autocomplete="new-password" />
    </label>
    <button type="submit" class="btn ghost" :disabled="props.loading">회원가입</button>
  </form>
</template>
