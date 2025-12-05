<template>
  <form class="form" @submit.prevent="handleSubmit">
    <label>
      이메일
      <input v-model="form.email" type="email" placeholder="you@example.com" autocomplete="email" />
    </label>
    <label>
      비밀번호
      <input
        v-model="form.password"
        type="password"
        placeholder="********"
        autocomplete="current-password"
      />
    </label>
    <button type="submit" class="btn primary" :disabled="props.loading">로그인</button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])

const form = reactive({
  email: '',
  password: '',
})

const handleSubmit = () => {
  emit('submit', { ...form })
}

const reset = () => {
  form.email = ''
  form.password = ''
}

defineExpose({ reset })
</script>
